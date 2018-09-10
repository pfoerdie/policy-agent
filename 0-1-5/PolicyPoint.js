/**
 * @module PolicyAgent.PolicyPoint
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    Color = require('colors'),
    V8n = require('v8n'),
    _private = new WeakMap(),
    _systemComponents = new Map();

V8n.extend({
    instanceof: (...validClasses) => value =>
        validClasses.some(validClass => value instanceof validClass),
    function: () => value =>
        typeof value === 'function',
    symbol: () => value =>
        typeof value === 'symbol',
    arrSchema: (schema) => value =>
        Array.isArray(value) ? schema.every((validator, index) => validator.test(value[index])) : false,
    JSON: () => value => {
        try {
            JSON.stringify(value, (key, value) => {
                V8n().not.function().check(value);
                return value;
            });
            return true;
        } catch (err) {
            return false;
        }
    }
});

/**
 * This is the base class for every PolicyPoint.
 * @name PolicyPoint
 */
class PolicyPoint {
    /**
     * @constructs PolicyPoint
     * @param {string} [instanceID=UUID()]
     * @package
     * @abstract
     */
    constructor(instanceID) {
        if (!new.target || new.target === PolicyPoint)
            throw new Error(`PolicyPoint is an abstract class`);
        if (typeof instanceID !== 'string')
            instanceID = UUID();

        Object.defineProperties(this, {
            /** 
             * An object that holds all data of the instance.
             * @name PolicyPoint#data
             * @type {object}
             * @package
             */
            data: {
                value: {}
            }
        });

        _private.set(this, {
            targetClass: new.target,
            className: new.target.name,
            instanceID: instanceID
        });

        if (_systemComponents.has(instanceID))
            this.throw('constructor', `id '${instanceID}' already exists`);
        else
            _systemComponents.set(instanceID, this);

    } // PolicyPoint#constructor

    /**
     * The id of this instance.
     * @name PolicyPoint#id
     * @type {string}
     * @public
     * @readonly
     */
    get id() {
        return _private.get(this).instanceID;
    } // PolicyPoint#id<getter>

    /**
     * This function is used to log events on this component.
     * @name PolicyPoint#log
     * @param {string} funcName The name of the function for this log entry.
     * @param {...(string|*)} messages If no string is submitted, the arguments will be used with the toString method.
     * @package
     */
    log(funcName, ...messages) {
        const _attr = _private.get(this);

        let logMsg = Color.blue(_attr.className) + Color.grey("<") + Color.magenta(_attr.instanceID) + Color.grey(">");
        if (funcName && typeof funcName === 'string')
            logMsg += Color.grey(".") + Color.cyan(funcName.trim());
        for (let msg of messages) {
            logMsg += "\n" + Color.grey("-> ") + msg.toString().trim();
        }

        console.log(logMsg);
    } // PolicyPoint#log

    /**
     * This function is used to log errors on this PolicyPoint. It will also throw an error.
     * @name PolicyPoint#throw
     * @param {string} funcName The name of the function for this log entry.
     * @param {(Error|*)} error If no error is submitted, the arguments will be used to create an error.
     * @throws {Error} Always throws an error.
     * @package
     */
    throw(funcName, error) {
        const _attr = _private.get(this);

        error = (error instanceof Error) ? error : new Error(error.toString().trim());

        let errMsg = Color.blue(_attr.className) + Color.grey("<") + Color.magenta(_attr.instanceID) + Color.grey(">");
        if (funcName && typeof funcName === 'string')
            errMsg += Color.grey(".") + Color.cyan(funcName.trim());
        errMsg += "\n" + Color.grey("-> ") + error.toString().trim();

        console.error(errMsg);
        throw error;
    } // PolicyPoint#throw

    /**
     * TODO
     * @param {*} funcName 
     */
    toString(funcName) {
        const _attr = _private.get(this);

        let str = `${_attr.className}<${_attr.instanceID}>`;
        if (funcName && typeof funcName === 'string')
            str += `.${funcName}`;

        return str;
    } // PolicyPoint#toString

    /**
     * TODO
     */
    static getComponent(instanceID) {
        let instance = _systemComponents.get(instanceID);
        return (instance && instance instanceof this) ? instance : undefined;
    } // PolicyPoint#getComponent

} // PolicyPoint

module.exports = PolicyPoint;