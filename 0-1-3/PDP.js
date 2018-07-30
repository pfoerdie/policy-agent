/**
 * @module PolicyAgent~PDP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    PolicyPoint = require(Path.join(__dirname, "PolicyPoint.js")),
    PIP = require(Path.join(__dirname, "PIP.js")),
    DataStore = require(Path.join(__dirname, "DataStore.js"));

function constructCypherQuery(odrlRequest) {
    let queryBlocks = [];

    // find the action and the target
    queryBlocks.push(`MATCH (action:ODRL:Action {id: "${odrlRequest['action']}"})`);
    queryBlocks.push(`MATCH (target:ODRL:${odrlRequest['target']['@type']} {uid: "${odrlRequest['target']['uid']}"})`);

    // if assignee or assigner are present, find them too
    if (odrlRequest['assignee'])
        queryBlocks.push(`MATCH (assignee:ODRL:${odrlRequest['assignee']['@type']} {uid: "${odrlRequest['assignee']['uid']}"})`);
    if (odrlRequest['assigner'])
        queryBlocks.push(`MATCH (assigner:ODRL:${odrlRequest['assigner']['@type']} {uid: "${odrlRequest['assigner']['uid']}"})`);

    // search for every policy, that is related to that target and action
    queryBlocks.push(`MATCH (policy:ODRL:Policy)-[*]->(rule:ODRL:Rule)-[:target]->(target)`);
    queryBlocks.push(`WHERE ( (rule)-[:action]->(action) OR (rule)-[:action]->(:ODRL:Action)-[:value]->(action) )`);

    // filter further with by assignee reference ...
    if (odrlRequest['assignee'])
        queryBlocks.push(`AND ( (rule)-[:assignee]->(assignee) OR NOT (rule)-[:assignee]->(:ODRL) )`);
    else
        queryBlocks.push(`AND NOT (rule)-[:assignee]->(:ODRL)`);

    // ... and assigner reference
    if (odrlRequest['assigner'])
        queryBlocks.push(`AND ( (rule)-[:assigner]->(assigner) OR NOT (rule)-[:assigner]->(:ODRL) )`);
    else
        queryBlocks.push(`AND NOT (rule)-[:assigner]->(:ODRL)`);

    // return collected results
    queryBlocks.push(`RETURN`);
    queryBlocks.push(`policy.uid AS policy,`);
    queryBlocks.push(`rule.uid AS rule,`);
    queryBlocks.push(`target.uid AS target,`);
    if (odrlRequest['assignee']) queryBlocks.push(`assignee.uid AS assignee,`);
    if (odrlRequest['assigner']) queryBlocks.push(`assigner.uid AS assigner,`);
    queryBlocks.push(`action.id AS action`);

    // TODO hier ist vieeel potential noch

    return queryBlocks.join(" \n");
} // PDP~constructCypherQuery

/**
 * Policy Decision Point
 * @name PDP
 */
class PDP extends PolicyPoint {
    /**
     * @constructs PDP
     * @param {Neo4jStore} policyStore 
     */
    constructor(policyStore) {
        super('PDP');

        Object.defineProperties(this.param, {
            policyStore: {
                value: Utility.validParam(param => param instanceof DataStore.Neo4j, policyStore)
            }
        });

        Object.defineProperties(this.data, {
            connectedPIPs: {
                value: []
            }
        });
    } // PDP#constructor

    /**
     * @name PDP#ready
     * @inheritdoc
     */
    get ready() {
        if (this.data.connectedPIPs.length === 0) {
            console.warn(this.toString('ready', null, `there are no connected PIPs`));
            return false;
        }

        // TODO alle #ready Funktionen entfernen und stattdessen die Bedingungen selber überprüfen

        return super.ready;
    } // PDP#ready<getter>

    /**
     * Connected PIPs will be used in the order of connection.
     * @name PDP#connectPIP
     * @param {PIP} targetPDP The PIP to connect.
     * @returns {undefined}
     * @public
     */
    connectPIP(targetPIP) {
        if (!(targetPIP instanceof PIP))
            throw new Error(this.toString('connectPIP', 'targetPIP', `targetPIP has to be a PIP`));
        if (this.data.connectedPIPs.includes(targetPIP))
            throw new Error(this.toString('connectPIP', 'targetPIP', `targetPIP has already been connected`));

        this.data.connectedPIPs.push(targetPIP);
    } // PDP#connectPIP

    /**
     * After the PEP created a context for the request, it sends the context for decision to this function.
     * @name PDP#_request
     * @param {context} context The context for the request.
     * @returns {*} // TODO jsDoc PDP#_request -> @returns
     */
    async _request(context) {
        if (!this.ready)
            throw new Error(this.toString('_request', null, `PDP is not ready jet`));

        context.log(`context reached ${this.toString('_request')}`);

        /**
         * This type resembles the internal request format.
         * @typedef {object} PDP~odrlRequest
         * @property {string} action The @id of the action (Action) in the policyStore.
         * @property {{@type: string, uid: string}} target The target {(Asset|AssetCollection|Party|PartyCollection)} of the request.
         * @property {{@type: string, uid: string}} [assignee] The optional assignee {(Party|PartyCollection)} of the request.
         * @property {{@type: string, uid: string}} [assigner] The optional assigner {(Party|PartyCollection)} of the request.
         */

        /** @name PDP~odrlRequest.action */
        let actionID = context.param.requestBody['action'] || context.param.requestSession['action'];
        if (typeof actionID !== 'string')
            throw new Error(this.toString('_request', null, `action is not well defined`));

        context.data.odrlRequest['action'] = actionID;

        for (let targetPIP of this.data.connectedPIPs) {
            await targetPIP._enrichRequest(context);
        }

        /** @name PDP~odrlRequest.target */
        let target = context.data.odrlRequest['target'];
        if (!(target && typeof target['@type'] === 'string' && typeof target['uid'] === 'string'))
            throw new Error(this.toString('_request', null, `target is not well defined`));

        /** @name PDP~odrlRequest.assignee */
        let assignee = context.data.odrlRequest['assignee'];
        if (assignee && !(typeof assignee['@type'] === 'string' && typeof assignee['uid'] === 'string'))
            throw new Error(this.toString('_request', null, `assignee is not well defined`));

        /** @name PDP~odrlRequest.assigner */
        let assigner = context.data.odrlRequest['assigner'];
        if (assigner && !(typeof assigner['@type'] === 'string' && typeof assigner['uid'] === 'string'))
            throw new Error(this.toString('_request', null, `assigner is not well defined`));

        let cypherRequest = constructCypherQuery.call(this, context.data.odrlRequest);

        context.log(this.toString('_request', null, `cypher query was generated`));
        context._audit('cypher', cypherRequest);

        this.param.policyStore._execute(cypherRequest).then(console.log).catch(console.error);

        // TODO PDP#_request -> neo4j requesten und ergebnis auswerten
        // evtl. weitere attributes anfordern

        return context.data.odrlRequest['target'] ? context.data.requestCache.get(context.data.odrlRequest['target']['uid']) : null; // TODO PDP#_request -> temp
    } // PDP#_request

} // PDP

Utility.getPublicClass(PDP);
module.exports = PDP;