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
 * @name _makeRequestQuery
 * @param {JSON} action 
 * @param {Map<string, JSON>} subjects 
 * @returns {string}
 * @this {PDP}
 * @private
 */
function _makeRequestQuery(action, subjects) {

    const queryBlocks = [];

    let
        target = subjects.get('target'),
        assignee = subjects.get('assignee'),
        assigner = subjects.get('assigner');

    // find the action and the target
    queryBlocks.push(`MATCH (action:ODRL:Action {id: "${action['@id']}"})`);
    queryBlocks.push(`MATCH (target:ODRL:Asset} {uid: "${target['@id']}"})`);

    // if assignee or assigner are present, find them too
    if (assignee) queryBlocks.push(`MATCH (assignee:ODRL:Party} {uid: "${assignee['@id']}"})`);
    if (assigner) queryBlocks.push(`MATCH (assigner:ODRL:Party} {uid: "${assigner['@id']}"})`);

    // search for every policy, that is related to that target and action
    queryBlocks.push(`MATCH (policy:ODRL:Policy)-[*]->(rule:ODRL:Rule)-[:target]->(target)`);
    queryBlocks.push(`WHERE ( (rule)-[:action]->(action) OR (rule)-[:action]->(:ODRL:Action)-[:value]->(action) )`);

    // filter further with by assignee reference ...
    if (assignee) queryBlocks.push(`AND ( (rule)-[:assignee]->(assignee) OR NOT (rule)-[:assignee]->(:ODRL) )`);
    else queryBlocks.push(`AND NOT (rule)-[:assignee]->(:ODRL)`);

    // ... and assigner reference
    if (assigner) queryBlocks.push(`AND ( (rule)-[:assigner]->(assigner) OR NOT (rule)-[:assigner]->(:ODRL) )`);
    else queryBlocks.push(`AND NOT (rule)-[:assigner]->(:ODRL)`);

    // return collected results
    queryBlocks.push(`RETURN`);
    queryBlocks.push(`policy,`);
    queryBlocks.push(`rule,`);
    queryBlocks.push(`target,`);
    if (assignee) queryBlocks.push(`assignee,`);
    if (assigner) queryBlocks.push(`assigner,`);
    queryBlocks.push(`action.id AS action`);

    // TODO hier ist noch vieeel potential 

    return queryBlocks.join("\n");

} // _makeRequestQuery

/**
 * @name PDP
 * @extends PolicyPoint
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
    async _requestDecision(context) {
        if (!(context instanceof Context))
            this.throw('_requestDecision', new TypeError(`invalid argument`));

        if (!this.data.administrationPoint)
            this.throw('_requestDecision', new Error(`administrationPoint not connected`));
        if (!this.data.informationPoint)
            this.throw('_requestDecision', new Error(`informationPoint not connected`));

        await this.data.informationPoint._retrieveSubjects(context);

        let
            cypherQuery = _makeRequestQuery.call(this, context.attr.action, context.attr.subjects),
            queryResult = await this.data.administrationPoint._retrievePolicies(cypherQuery);

        console.log(queryResult);

        // TODO

        context.decision = "Indeterminate";

    } // PDP#_requestDecision

} // PDP

Object.defineProperties(PDP, {});

module.exports = PDP;