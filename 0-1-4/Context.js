/**
 * @module PolicyAgent~Context
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    V8n = require('v8n'),
    _private = new WeakMap();

/**
 * @name Context
 * @extends PolicyAgent~SystemComponent
 */
class Context extends SystemComponent {
    /**
     * @constructs Context
     * @param {(Session|object)} session The session from which the context was created.
     * @param {object} param The parametrization for the context.
     * @package
     */
    constructor(session, param) {
        super();

        V8n().object().check(session);
        V8n().object().check(param);

        // TODO session und param mit V8n .optional und .schema überprüfen
        // TODO zusätzlich jsDoc vervollständigen

        Object.assign(this.param, param, session);

        Object.defineProperties(this, {
            session: {
                value: session
            }
        });
    } // Context#constructor

} // Context

module.exports = Context;