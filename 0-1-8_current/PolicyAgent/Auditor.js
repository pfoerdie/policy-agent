/**
 * Auditor
 * @module PolicyAgent.Auditor
 * @author Simon Petrac
 */

const
    Color = require('colors'),
    UUID = require('uuid/v4'),
    _instances = new WeakMap();

exports.register = register_;
function register_(instance, className, instanceID = UUID()) {
    if (!instance || typeof instance !== 'object' || !className || typeof className !== 'string' || !instanceID || typeof instanceID !== 'string')
        throw new TypeError("invalid argument");

    _instances.set(instance, { className, instanceID });
    return bind_(instance);
} // register_

exports.bind = bind_;
function bind_(instance) {
    if (!_instances.has(instance))
        throw new Error("instance unknown");

    return {
        toString: (...args) => toString_(instance, ...args),
        audit: (...args) => audit_(instance, ...args),
        log: (...args) => log_(instance, ...args),
        throw: (...args) => throw_(instance, ...args)
    };
} // bind_

exports.toString = toString_;
function toString_(instance, fnName, colored = false) {
    if (!_instances.has(instance))
        throw new Error("instance unknown");

    let { className, instanceID } = _instances.get(instance);

    let str = colored
        ? Color.blue(className) + Color.grey("<") + Color.magenta(instanceID) + Color.grey(">")
        : `${className}<${instanceID}>`;

    if (fnName && typeof fnName === 'string')
        str += colored
            ? Color.grey(".") + Color.cyan(fnName.trim())
            : `.${fnName.trim()}`;

    return str;
} // toString_

exports.audit = audit_;
function audit_(instance, topic, ...args) {

    // NOTE proper auditing here

} // audit_

exports.log = log_;
function log_(instance, fnName, ...messages) {
    if (!_instances.has(instance))
        throw new Error("instance unknown");

    let logMsg = toString_(instance, fnName, true);
    for (let msg of messages) {
        logMsg += "\n" + Color.grey("-> ") + msg.toString().trim();
    }

    console.log(logMsg);
    audit_(instance, 'log', logMsg);
} // log_

exports.throw = throw_;
function throw_(instance, fnName, error, silent = false) {
    if (!_instances.has(instance))
        throw new Error("instance unknown");

    error = (error instanceof Error) ? error : new Error(error.toString().trim());

    let errMsg = toString_(instance, fnName, true);
    errMsg += "\n" + Color.grey("-> ") + error.toString().trim();

    console.error(errMsg);
    audit_(instance, 'error', errMsg);

    if (silent) return error;
    else throw error;
} // throw_