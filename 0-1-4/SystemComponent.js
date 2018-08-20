/**
 * @module PolicyAgent~SystemComponent
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    Color = require('colors'),
    V8n = require('v8n'),
    _private = new WeakMap();

V8n.extend({
    ofClass: (expectedClass) => value => value instanceof expectedClass,
    function: () => value => typeof value === 'function'
});

/**
 * This is the base class for every component of the PolicyAgent.
 * @name SystemComponent
 */
class SystemComponent {
    /**
     * @constructs SystemComponent
     * @package
     * @abstract
     */
    constructor() {
        if (!new.target || new.target === SystemComponent)
            throw new Error(`SystemComponent is an abstract class`);

        Object.defineProperties(this, {
            /** 
             * An object that represents all parametrization of the instance.
             * @name SystemComponent#param
             * @type {object}
             */
            param: {
                value: {}
            },
            /** 
             * An object that represents all generated data of the instance.
             * @name SystemComponent#data
             * @type {object}
             */
            data: {
                value: {}
            }
        });

        _private.set(this, {
            className: new.target.name,
            instanceID: UUID()
        });
    } // SystemComponent#constructor

    /**
     * The id of this instance.
     * @name SystemComponent#id
     * @type {UUID}
     * @public
     */
    get id() {
        return _private.get(this).instanceID;
    } // SystemComponent#id<getter>

    /**
     * This function is used to log events on this component.
     * @name SystemComponent#log
     * @param {string} funcName The name of the function for this log entry.
     * @param {(string|*)} message If no string is submitted, the arguments will be used with the toString method.
     * @package
     */
    log(funcName, message) {
        const _attr = _private.get(this);

        try {
            V8n().string().check(funcName);
        } catch (err) {
            this.throw('log', err);
        }

        console.log(
            Color.blue(_attr.className) +
            Color.grey("<") + Color.magenta(_attr.instanceID) + Color.grey(">.") +
            Color.cyan(funcName) + "\n" +
            Color.grey("-> ") + message.toString().trim()
        );
    } // SystemComponent#log

    /**
     * This function is used to log errors on this component. It will also throw an error.
     * @name SystemComponent#throw
     * @param {string} funcName The name of the function for this log entry.
     * @param {(Error|*)} error If no error is submitted, the arguments will be used to create an error.
     * @throws {Error}
     * @package
     */
    throw(funcName, error) {
        const _attr = _private.get(this);

        try {
            V8n().string().check(funcName);
        } catch (err) {
            this.throw('throw', err);
        }

        error = (error instanceof Error) ? error : new Error(error.toString().trim());

        console.error(
            Color.blue(_attr.className) +
            Color.grey("<") + Color.magenta(_attr.instanceID) + Color.grey(">.") +
            Color.cyan(funcName) + "\n" +
            Color.grey("-> ") + error.toString()
        );

        throw error;
    } // SystemComponent#throw

} // SystemComponent

module.exports = SystemComponent;