/**
 * @module PolicyAgent.Context
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    Color = require('colors'),
    PolicyPoint = require('./PolicyPoint.js'),
    _private = new WeakMap();

//#region Context

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
    constructor(session, subject) {
        _private.set(this, {
            instanceID: UUID()
        });

        if (!session || typeof session !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));
        if (!subject || typeof subjext !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));

        if (
            !subject['action'] || typeof subject['action'] !== 'object' || typeof subject['action']['@id'] !== 'string' ||
            !subject['relation'] || typeof subject['relation'] !== 'object' ||
            !subject['function'] || typeof subject['function'] !== 'object'
        )
            this.throw('constructor', new TypeError(`invalid argument`));

        Object.defineProperties(this, {
            /**
             * @name Context#subject
             * @type {object}
             * NOTE XACML request.subject:
             * -> An actor whose attributes may be referenced by a predicate
             *    (Predicate := A statement about attributes whose truth can be evaluated)
             */
            subject: {
                value: Object.freeze(subject)
            },
            /**
             * @name Context#resource
             * @type {object}
             * NOTE XACML request.resource:
             * -> Data, service or system component
             */
            resource: {
                value: Object.create({}, {
                    session: {
                        value: session
                    },
                    cache: {
                        value: new Map()
                    },
                    includedActions: {
                        value: {}
                    },
                    stage: { // TODO rework
                        value: {}
                    }
                })
            },
            /**
             * @name Context#environment
             * @type {object}
             * NOTE XACML request.environment:
             * -> The set of attributes that are relevant to an authorization decision 
             *    and are independent of a particular subject, resource or action
             */
            environment: {
                value: Object.create({}, {
                    timestamp: {
                        value: Date.now()
                    }
                })
            },
            /**
             * This object will contain the action callback for the request.
             * It is initialized with a placeholder function.
             * @name Context#action
             * @type {object}
             * NOTE XACML request.action:
             * -> An operation on a resource
             */
            action: {
                writable: true,
                value: () => { throw new Error(`Context#action -> placeholder`) }
            }
        });

        this.log(undefined, `instantiated`);
    } // Context.constructor

    /**
     * Wrapper for function calls with its first argument beeing the context.
     * @name Context#next
     * @param {function} fn Function to call.
     * @param  {...*} [args] Additional arguments for the function.
     * @returns {*} Result of the function. May be a Promise.
     * @package
     */
    next(fn, ...args) {
        if (typeof fn !== 'function')
            this.throw('next', new TypeError(`invalid argument`));

        return fn(this, ...args);
    } // Context#next

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
    throw(funcName, error) {
        error = (error instanceof Error) ? error : new Error(error.toString().trim());

        let errMsg = this.toString(funcName, true);
        errMsg += "\n" + Color.grey("-> ") + error.toString().trim();
        console.error(errMsg);

        throw error;
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
            ? Color.blue(_attr.className) + Color.grey("<") + Color.magenta(_attr.instanceID) + Color.grey(">")
            : `${_attr.className}<${_attr.instanceID}>`;

        if (funcName && typeof funcName === 'string')
            str += colored
                ? Color.grey(".") + Color.cyan(funcName.trim())
                : `.${funcName.trim()}`;

        return str;
    } // PolicyPoint#toString

} // Context

//#endregion Context

module.exports = Context;