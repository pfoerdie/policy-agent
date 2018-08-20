/**
 * @module PolicyAgent~PDP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    DataStore = require(Path.join(__dirname, "DataStore.js")),
    PIP = require(Path.join(__dirname, "PIP.js")),
    V8n = require('v8n');

/**
 * Policy Decision Point
 * @name PDP
 * @extends PolicyAgent~SystemComponent
 */
class PDP extends SystemComponent {
    /**
     * @param {PolicyAgent~DataStore.Neo4j} policyStore
     * @constructs PDP
     * @public
     */
    constructor(policyStore) {
        super();

        try { // argument validation
            V8n().ofClass(DataStore.Neo4j).check(policyStore);
        } catch (err) {
            this.throw('constructor', err);
        }

        Object.defineProperties(this.param, {
            policyStore: {
                value: policyStore
            }
        });

        Object.defineProperties(this.data, {
            connectedPIPs: {
                value: []
            }
        });
    } // PDP#constructor

} // PDP

module.exports = PDP;