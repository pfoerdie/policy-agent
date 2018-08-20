/**
 * @module PolicyAgent~PAP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    V8n = require('v8n');

/**
 * Policy Administration Point
 * @name PAP
 * @extends PolicyAgent~SystemComponent
 */
class PAP extends SystemComponent {
    /**
     * @constructs PAP
     * @public
     */
    constructor() {
        super();

        Object.defineProperties(this.param, {

        });

        Object.defineProperties(this.data, {

        });
    } // PAP#constructor

} // PAP

module.exports = PAP;