/**
 * @module PolicyAgent~PIP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    Context = require(Path.join(__dirname, "Context.js")),
    DataStore = require(Path.join(__dirname, "DataStore.js")),
    V8n = require('v8n');

/**
 * Policy Information Point
 * @name PIP
 * @extends PolicyAgent~SystemComponent
 */
class PIP extends SystemComponent {
    /**
     * @param {PolicyAgent~DataStore.MongoDB} attributeStore
     * @constructs PIP
     * @public
     */
    constructor(attributeStore) {
        super();

        try { // argument validation
            V8n().ofClass(DataStore.MongoDB).check(attributeStore);
        } catch (err) {
            this.throw('constructor', err);
        }

        Object.defineProperties(this.data, {
            attributeStore: {
                value: attributeStore
            }
        });
    } // PIP#constructor

} // PIP

module.exports = PIP;