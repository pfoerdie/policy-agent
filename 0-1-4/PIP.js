/**
 * @module PolicyAgent~PIP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    V8n = require('v8n'),
    _private = new WeakMap();

/**
 * Policy Execution Point
 * @name PIP
 * @extends PolicyAgent~SystemComponent
 */
class PIP extends SystemComponent {
    /**
     * @constructs PIP
     * @public
     */
    constructor() {
        super();

        Object.defineProperties(this.param, {

        });

        Object.defineProperties(this.data, {

        });
    } // PIP#constructor

} // PIP

module.exports = PIP;