/**
 * @module PolicyAgent~Context
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    UUID = require('uuid/v4');

/**
 * @name Context
 */
class Context {

    constructor(session, param) {
        session.touch();

        Object.defineProperties(this, {
            id: {
                enumerable: true,
                value: UUID()
            },
            session: {
                enumerable: true,
                value: session || {}
            },
            param: { // TODO umbenennen in request oder so -> muss überall geändert werden
                enumerable: true,
                value: param || {}
            },
            data: { // TODO umbenennen in result oder so -> muss überall geändert werden
                enumerable: true,
                value: {}
            },
            audits: {
                value: []
            }
            // IDEA Parametrisierung für die console.info Funktion 
            // -> default auf false, kann aber dank {writable: true, configurable: false} auf true gestellt werden
        });

        // TODO

        this.log(`context constructed @${Utility.toStringColorScheme('Session', this.session.id)}`);
    } // Context#constructor

    /**
     * @function Context#_audit
     * @param {string} topic The topic for the arguments.
     * @param {...*} args The arguments that should be audited.
     * @returns {undefined}
     * @package
     */
    _audit(topic, ...args) {
        if (typeof topic !== 'string')
            throw new Error(this.toString('_audit', 'topic, ...args', `topic has to be a string`));

        let entry = [topic, Date.now(), ...args];

        console.info(Utility.toStringColorScheme('Audit', null, entry[0], null, args.join(" | "), entry[1]));
        // console.info(Utility.toStringColorScheme('Context', this.id, '_audit', `type = ${entry[0]}`, args.join(" | "), entry[1]));

        this.audits.push(entry);
    } // Context#_audit

    /**
     * Sends a log message to the contexts audit function.
     * @name Context#log
     * @param {string} message The log message.
     * @returns {undefined}
     * @public
     */
    log(message) {
        if (typeof message !== 'string')
            throw new Error(this.toString('log', 'message', `message has to be a string`));

        this._audit('log', message);
    } // Context#log

    _get(attr) {
        // TODO vllt sollte ich mir hier ein anderes Vorgehen überlegen !!!
        if (this.data[attr])
            return this.data[attr];
        else if (this.param[attr])
            return this.param[attr];
        else if (this.session[attr])
            return this.session[attr];
        else return null;
    } // Context#_get

    /**
     * Replaces the nativ string representation of an object by a simple string notation of the context.
     * @name Context#toString
     * @returns {string} String notation for the context.
     * @package
     * @override
     */
    toString(...args) {
        return Utility.toStringColorScheme('Context', this.id, ...args);
    } // Context#toString

} // Context

Utility.getPublicClass(Context);
module.exports = Context;