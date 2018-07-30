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

async function fillDataAtConnectedPIPs(context) {
    for (let targetPIP of this.data.connectedPIPs) {
        await targetPIP._fillData(context);
    }

    return context;
} // PDP~fillDataAtConnectedPIPs

function constructCypherQuery(action, target, assignee, assigner) {

    // TODO PDP~constructCypherQuery

    return 'RETURN NULL';
} // PDP~constructCypherQuery

/**
 * @name PDP
 */
class PDP extends PolicyPoint {

    constructor(policyStore) {
        if (!(policyStore instanceof DataStore.Neo4j))
            throw new Error(`PDP#constructor(policyStore) -> invalid policyStore`);

        super('PDP');

        this.data.policyStore = policyStore;
        this.data.connectedPIPs = [];

        // TODO PDP#constructor
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

    async _request(context) {
        if (!this.ready)
            throw new Error(this.toString('_request', null, `PDP is not ready jet`));

        context.log(`context reached ${this.toString('_request')}`);

        await fillDataAtConnectedPIPs.call(this, context);

        let cypherRequest = constructCypherQuery.call(
            this,
            context._get('action'),
            context._get('target'),
            context._get('assignee'),
            context._get('assigner')
        );

        context.log(this.toString('_request', null, `cypher query was generated`));

        // TODO PDP#_request

        return context;
    } // PDP#_request

} // PDP

Utility.getPublicClass(PDP);
module.exports = PDP;