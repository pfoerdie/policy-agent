/**
 * @module PolicyAgent~PEP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    V8n = require('v8n');

/**
 * Policy Execution Point
 * @name PEP
 * @extends PolicyAgent~SystemComponent
 */
class PEP extends SystemComponent {
    /**
     * @constructs PEP
     * @public
     */
    constructor() {
        super();

        Object.defineProperties(this.param, {

        });

        Object.defineProperties(this.data, {

        });
    } // PEP#constructor

} // PEP

module.exports = PEP;