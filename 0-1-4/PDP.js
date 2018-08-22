/**
 * @module PolicyAgent.PDP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    Context = require(Path.join(__dirname, "Context.js")),
    DataStore = require(Path.join(__dirname, "DataStore.js")),
    PIP = require(Path.join(__dirname, "PIP.js")),
    V8n = require('v8n');

/**
 * Policy Decision Point
 * @name PDP
 * @extends PolicyAgent.SystemComponent
 */
class PDP extends SystemComponent {
    /**
     * @param {PolicyAgent.DataStore.Neo4j} policyStore
     * @constructs PDP
     * @public
     */
    constructor(policyStore, informationPoint) {
        super('PDP');

        if (V8n().not.arrSchema([
            V8n().ofClass(DataStore.Neo4j), // policyStore
            V8n().componentType('PIP') // informationPoint
        ]).test(arguments)) {
            this.throw('constructor', new TypeError(`invalid arguments`));
        } // argument validation

        Object.defineProperties(this.data, {
            policyStore: {
                value: policyStore
            },
            informationPoint: {
                value: informationPoint
            }
        });
    } // PDP#constructor

    /**
     * @name PDP#_request
     * @param {Context} context 
     * @package
     * @async
     * TODO implementation
     */
    async _request(context) {
    } // PDP#_request

} // PDP

module.exports = PDP;