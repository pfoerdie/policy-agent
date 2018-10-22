/**
 * Policy Decision Point
 * @module PolicyAgent.PDP
 * @author Simon Petrac
 */

const
    PolicyPoint = require('./PolicyPoint.js'),
    Context = require('./Context.js'),
    PIP = require('./PIP.js'),
    PAP = require('./PAP.js');

/**
 * @name PDP
 * @extends PolicyAgent.PolicyPoint
 */
class PDP extends PolicyPoint {
    /**
     * @constructs PDP
     * @param {JSON} [options={}]
     * @abstract
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.administrationPoint = null;
        this.data.informationPoint = null;

    } // PDP.constructor

    /**
     * Adds a PIP to retrieve information.
     * @name PDP#connectPIP
     * @param {PolicyAgent.PIP} informationPoint 
     */
    connectPIP(informationPoint) {
        if (!(informationPoint instanceof PIP))
            this.throw('connectPIP', new TypeError(`invalid argument`));
        if (this.data.informationPoint)
            this.throw('connectPIP', `AttributeStore already connected`);

        this.data.informationPoint = informationPoint;
        this.log('connectPIP', `${informationPoint.toString(undefined, true)} connected`);
    } // PDP#connectPIP

    /**
     * Adds a PAP to retrieve policies.
     * @name PDP#connectPAP
     * @param {PolicyAgent.PAP} administrationPoint 
     */
    connectPAP(administrationPoint) {
        if (!(administrationPoint instanceof PAP))
            this.throw('connectPAP', new TypeError(`invalid argument`));
        if (this.data.administrationPoint)
            this.throw('connectPAP', `PAP already connected`);

        this.data.administrationPoint = administrationPoint;
        this.log('connectPAP', `${administrationPoint.toString(undefined, true)} connected`);
    } // PDP#connectPAP

    /**
     * @name PDP#_requestDecision
     * @param {Context} context
     * @async
     * 
     * INFO 7.17 Authorization decision:
     *   -> The PDP MUST return a response context, with one <Decision> element of value "Permit", "Deny", "Indeterminate" or "NotApplicable".
     */
    async _requestDecision(requestContext) {
        if (!(requestContext instanceof Context.Request))
            this.throw('_requestDecision', new TypeError(`invalid argument`));

        if (!this.data.informationPoint)
            this.throw('_requestDecision', new Error(`informationPoint not connected`));
        if (!this.data.administrationPoint)
            this.throw('_requestDecision', new Error(`administrationPoint not connected`));

        const responseContext = new Context.Response(requestContext);

        try {
            responseContext.entries = await Promise.all(requestContext.entries.map((entry, index) => (async () => {
                try {
                    let
                        subject = await this.data.informationPoint._retrieveSubjects(entry.subject),
                        action = Object.assign({}, entry.action);

                    action.id = action['@id'];
                    return { action, subject, index, decision: "NotApplicable" };
                } catch (err) {
                    // do nothing
                }
            })(/* async instead of promise */)));

            let
                cypherQuery = [
                    // IDEA vllt einen index in entry speichern, um später die Ergebnisse zuordnen zu können
                    `UNWIND $entries AS entry`,
                    `MATCH (action:ODRL:Action {id: entry.action.id})`,
                    `MATCH (target:ODRL:Asset {uid: entry.subject.target.uid})`,
                    `OPTIONAL MATCH (assignee:ODRL:Party {uid: entry.subject.assignee.uid})`,
                    `OPTIONAL MATCH (assigner:ODRL:Party {uid: entry.subject.assigner.uid})`,

                    `WITH entry.index AS index, action, target, assignee, assigner`,
                    `MATCH path = (policy:ODRL:Policy)-[ruleRel:permission|:obligation|:prohibition]->(rule:ODRL:Rule)`,
                    `WHERE ( (rule)-[:target]->(target) OR (rule)-[:target]->(:ODRL:AssetCollection)<-[:partOf*]-(target) )`,
                    `AND ( (rule)-[:action]->(action) OR (rule)-[:action]->(:ODRL:Action)-[:value]->(action) )`,
                    `AND ( NOT (rule)-[:assignee]->(:ODRL) OR (rule)-[:assignee]->(assignee) OR (rule)-[:assignee]->(:ODRL:PartyCollection)<-[:partOf*]-(assignee) )`,
                    `AND ( NOT (rule)-[:assigner]->(:ODRL) OR (rule)-[:assigner]->(assigner) OR (rule)-[:assigner]->(:ODRL:PartyCollection)<-[:partOf*]-(assigner) )`,

                    `RETURN index, policy.uid AS policy, rule.uid AS rule, type(ruleRel) AS ruleType`
                ].join("\n"),
                recordsArr = await this.data.administrationPoint._request(cypherQuery, responseContext);

            function makeDecision(prev, record) {
                switch (prev) {
                    case 'Indeterminate':
                        break;
                    case 'NotApplicable':
                        if (record.ruleType === 'permission') return 'Permission';
                        if (record.ruleType === 'obligation') return 'Obligation';
                        if (record.ruleType === 'prohibition') return 'Prohibition';
                        break;
                    case 'Permission':
                        if (record.ruleType !== 'permission') return 'Indeterminate';
                        break;
                    case 'Obligation':
                        if (record.ruleType !== 'obligation') return 'Indeterminate';
                        break;
                    case 'Prohibition':
                        if (record.ruleType !== 'prohibition') return 'Indeterminate';
                        break;
                } // switch

                return prev;
            } // makeDecision

            for (let record of recordsArr) {
                let entry = responseContext.entries[record.index];

                entry.decision = makeDecision(entry.decision, record);
                responseContext.decision = makeDecision(responseContext.decision, record);
            } // for

            // TODO

        } catch (err) {
            // do nothing, just return the incomplete responseContext
            return responseContext;
        }

        /**
         * INFO {@link https://www.w3.org/TR/odrl-model/#conflict Policy Conflict Strategy}
         * The conflict property SHOULD take one of the following Conflict Strategy Preference values (instance of the ConflictTerm class):
         *      perm: the Permissions MUST override the Prohibitions
         *      prohibit: the Prohibitions MUST override the Permissions
         *      invalid: the entire Policy MUST be void if any conflict is detected
         * 
         * If the conflict property is not explicitly set, the default of invalid will be used.
         * 
         * The Conflict Strategy requirements include:
         *      If a Policy has the conflict property of perm then any conflicting Permission Rule MUST override the Prohibition Rule.
         *      If a Policy has the conflict property of prohibit then any conflicting Prohibition Rule MUST override the Permission Rule.
         *      If a Policy has the conflict property of invalid then any conflicting Rules MUST void the entire Policy.
         * 
         * INFO 7.17 Authorization decision:
         *   -> The PDP MUST return a response context, with one <Decision> element of value "Permit", "Deny", "Indeterminate" or "NotApplicable".
         * 
         * IDEA Aufteilung in: Indeterminate | Permission | Prohibition | Obligation | NotApplicable
         * TODO Unterscheidung von Set/Offer/Aggreement Policies
         */

        // TODO
        return responseContext;

    } // PDP#_requestDecision

} // PDP

Object.defineProperties(PDP, {});

module.exports = PDP;