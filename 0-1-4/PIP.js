/**
 * @module PolicyAgent~PIP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    V8n = require('v8n');

/**
 * Policy Information Point
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