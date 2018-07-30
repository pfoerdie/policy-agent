/**
 * @module PolicyAgent~PAP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    PolicyPoint = require(Path.join(__dirname, "PolicyPoint.js")),
    DataStore = require(Path.join(__dirname, "DataStore.js"));

/**
 * Policy Administration Point
 * @name PAP
 */
class PAP extends PolicyPoint {
    /**
     * @constructs PAP
     * @param {Neo4jStore} policyStore 
     */
    constructor(policyStore) {
        super('PAP');

        Object.defineProperties(this.param, {
            policyStore: {
                value: Utility.validParam(param => param instanceof DataStore.Neo4j, policyStore)
            }
        });
    } // PAP#constructor

    /**
     * @name PAP#ready
     * @inheritdoc
     */
    get ready() {
        return super.ready;
    } // PAP#ready<getter>

    async transferODRL(odrlJSON) {

    } // PAP#transferODRL

} // PAP

Utility.getPublicClass(PAP);
module.exports = PAP;