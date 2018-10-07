/**
 * Context
 * @module PolicyAgent.Context
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    Color = require('colors'),
    _private = new WeakMap();

/**
 * @name Context
 * 
 * INFO
 * Any Context instance shall never be revealed to the public as it is.
 */
class Context {
    /**
     * @constructs Context
     * @param {Session} session
     * @param {JSON} subject
     * @package
     */
    constructor(session, param) { // IDEA ...args hinzufügen, als Parameter für die Aktion später (zB um Request/Response zu übergeben)
        const _attr = {};
        _attr.instanceID = UUID();
        _private.set(this, _attr);

        if (!session || typeof session !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));
        if (!param || typeof param !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));

        _attr.session = session;
        _attr.decision = null;

        Object.defineProperties(this, {
            attr: {
                value: Object.create({}, {
                    /**
                     * INFO XACML request.action:
                     * -> An operation on a resource
                     */
                    action: {
                        value: {}
                    },
                    /**
                     * INFO XACML request.subject:
                     * -> An actor whose attributes may be referenced by a predicate
                     *    (Predicate := A statement about attributes whose truth can be evaluated)
                     * INFO  The relation and the function property of the ODRL will be combined into
                     *       this single subjects property of XACML.
                     */
                    subjects: {
                        value: new Map()
                    },
                    /**
                     * INFO XACML request.resource:
                     * -> Data, service or system component
                     */
                    resource: {
                        value: new Map()
                    },
                    /**
                     * INFO XACML request.environment:
                     * -> The set of attributes that are relevant to an authorization decision 
                     *    and are independent of a particular subject, resource or action
                     */
                    environment: {
                        value: new Map()
                    }
                })
            }
        });

        for (let key in param) {
            if (key === 'action') {
                let action = param[key];

                if (typeof action === 'string')
                    this.attr.action['@id'] = action;
                else if (action && typeof action === 'object' && typeof action['@id'] === 'string')
                    Object.assign(this.attr.action, action);
            } else {
                let subject = param[key];

                if (subject && typeof subject === 'object' && typeof subject['@type'] === 'string')
                    this.attr.subjects.set(key, subject);
            }
        } // transfer param to attr.action and attr.subjects

        if (!this.attr.action['@id'])
            this.throw('constructor', new Error(`invalid action`));
        if (!this.attr.subjects.has('target'))
            this.throw('constructor', new Error(`invalid target`));

    } // Context.constructor

    get session() {
        return _private.get(this).session;
    } // Context#session<getter>

    /**
     * @name Context#decision
     * @type {string} "Permit" | "Deny" | "Indeterminate" | "NotApplicable" | null
     * 
     * INFO 7.17 Authorization decision:
     *   -> The PDP MUST return a response context, with one <Decision> element of value "Permit", "Deny", "Indeterminate" or "NotApplicable".
     */
    get decision() {
        return _private.get(this).decision;
    } // Context#decision<getter>

    set decision(value) {
        const _attr = _private.get(this);

        if (_attr.decision)
            this.throw('decision', "already set");

        switch (value) {

            case 'Permit':
            case 'Deny':
            case 'Indeterminate':
            case 'NotApplicable':
                _attr.decision = value;
                break;

            default:
                this.throw('decision', new TypeError(`invalid argument`));

        } // switch
    } // Context#decision<setter>

    //#region logging

    /**
     * This function is used to log events on this component.
     * @name Context#log
     * @param {string} funcName The name of the function for this log entry.
     * @param {...(string|*)} messages If no string is submitted, the arguments will be used with the toString method.
     * @package
     */
    log(funcName, ...messages) {
        let logMsg = this.toString(funcName, true);
        for (let msg of messages) {
            logMsg += "\n" + Color.grey("-> ") + msg.toString().trim();
        }
        console.log(logMsg);
    } // Context#log

    /**
     * This function is used to log errors on this Context. It will also throw an error.
     * @name Context#throw
     * @param {string} funcName The name of the function for this log entry.
     * @param {(Error|*)} error If no error is submitted, the arguments will be used to create an error.
     * @throws {Error} Always throws an error.
     * @package
     */
    throw(funcName, error, silent = false) {
        error = (error instanceof Error) ? error : new Error(error.toString().trim());

        let errMsg = this.toString(funcName, true);
        errMsg += "\n" + Color.grey("-> ") + error.toString().trim();
        console.error(errMsg);

        if (silent) return error;
        else throw error;
    } // Context#throw

    /**
     * @name Context#toString
     * @param {string} [funcName] The name of a function to include in the output.
     * @param {boolean} [colored=false] Weather the output should make use of colors.
     * @returns {string}
     * @override
     */
    toString(funcName, colored = false) {
        const _attr = _private.get(this);

        if (!_attr)
            return Object.prototype.toString.call(this);

        let str = colored
            ? Color.blue("Context") + Color.grey("<") + Color.magenta(_attr.instanceID) + Color.grey(">")
            : `${"Context"}<${_attr.instanceID}>`;

        if (funcName && typeof funcName === 'string')
            str += colored
                ? Color.grey(".") + Color.cyan(funcName.trim())
                : `.${funcName.trim()}`;

        return str;
    } // PolicyPoint#toString

    //#endregion logging

} // Context

module.exports = Context;