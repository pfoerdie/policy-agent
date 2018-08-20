/**
 * @module PolicyAgent~DataStore
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    V8n = require('v8n'),
    _private = new WeakMap();

/**
 * Policy Execution Point
 * @name DataStore
 * @extends PolicyAgent~SystemComponent
 */
class DataStore extends SystemComponent {
    /**
     * @constructs DataStore
     * @public
     */
    constructor() {
        super();

        Object.defineProperties(this.param, {

        });

        Object.defineProperties(this.data, {

        });
    } // DataStore#constructor

} // DataStore

module.exports = DataStore;