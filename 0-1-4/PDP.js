/**
 * @module PolicyAgent~PDP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    V8n = require('v8n'),
    _private = new WeakMap();

/**
 * Policy Execution Point
 * @name PDP
 * @extends PolicyAgent~SystemComponent
 */
class PDP extends SystemComponent {
    /**
     * @constructs PDP
     * @public
     */
    constructor() {
        super();

        Object.defineProperties(this.param, {

        });

        Object.defineProperties(this.data, {

        });
    } // PDP#constructor

} // PDP

module.exports = PDP;