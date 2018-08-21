/**
 * @module PolicyAgent~PAP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    DataStore = require(Path.join(__dirname, "DataStore.js")),
    V8n = require('v8n');

/**
 * Policy Administration Point
 * @name PAP
 * @extends PolicyAgent~SystemComponent
 */
class PAP extends SystemComponent {
    /**
     * @param {PolicyAgent~DataStore.Neo4j} policyStore
     * @constructs PAP
     * @public
     */
    constructor(policyStore) {
        super();

        try { // argument validation
            V8n().ofClass(DataStore.Neo4j).check(policyStore);
        } catch (err) {
            this.throw('constructor', err);
        }

        Object.defineProperties(this.data, {
            policyStore: {
                value: policyStore
            }
        });
    } // PAP#constructor

} // PAP

module.exports = PAP;