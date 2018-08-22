/**
 * @module PolicyAgent.SystemComponent
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    Color = require('colors'),
    V8n = require('v8n'),
    systemAttributes = new WeakMap();

V8n.extend({
    ofClass: (...validClasses) => value => {
        for (let expectedClass of validClasses) {
            if (value instanceof expectedClass)
                return true;
        }
        return false;
    },
    componentType: (expectedType) => value =>
        value instanceof SystemComponent &&
        systemAttributes.get(value).type === expectedType,
    function: () => value =>
        typeof value === 'function',
    arrSchema: (schema) => value => {
        try {
            for (let index in schema) {
                schema[index].check(value[index]);
            }
            return true;
        } catch (err) {
            return false;
        }
    },
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
 * This is the base class for every component of the PolicyAgent.
 * @name SystemComponent
 */
class SystemComponent {
    /**
     * @constructs SystemComponent
     * @package
     * @abstract
     */
    constructor(type) {
        if (!new.target || new.target === SystemComponent)
            throw new Error(`SystemComponent is an abstract class`);
        if (typeof type !== 'string')
            throw new Error(`SystemComponent needs a type`);

        Object.defineProperties(this, {
            /** 
             * An object that holds all data of the instance.
             * @name SystemComponent#data
             * @type {object}
             */
            data: {
                value: {}
            }
        });

        systemAttributes.set(this, {
            type: type,
            className: new.target.name,
            instanceID: UUID()
        });
    } // SystemComponent#constructor

    /**
     * The id of this instance.
     * @name SystemComponent#id
     * @type {UUID}
     * @public
     * @readonly
     */
    get id() {
        return systemAttributes.get(this).instanceID;
    } // SystemComponent#id<getter>

    /**
     * This function is used to log events on this component.
     * @name SystemComponent#log
     * @param {string} funcName The name of the function for this log entry.
     * @param {...(string|*)} messages If no string is submitted, the arguments will be used with the toString method.
     * @package
     */
    log(funcName, ...messages) {
        const _attr = systemAttributes.get(this);

        let logMsg = Color.blue(_attr.className) + Color.grey("<") + Color.magenta(_attr.instanceID) + Color.grey(">");
        if (funcName && typeof funcName === 'string')
            logMsg += Color.grey(".") + Color.cyan(funcName.trim());
        for (let msg of messages) {
            logMsg += "\n" + Color.grey("-> ") + msg.toString().trim();
        }

        console.log(logMsg);
    } // SystemComponent#log

    /**
     * This function is used to log errors on this component. It will also throw an error.
     * @name SystemComponent#throw
     * @param {string} funcName The name of the function for this log entry.
     * @param {(Error|*)} error If no error is submitted, the arguments will be used to create an error.
     * @throws {Error} Always throws an error.
     * @package
     */
    throw(funcName, error) {
        const _attr = systemAttributes.get(this);

        error = (error instanceof Error) ? error : new Error(error.toString().trim());

        let errMsg = Color.blue(_attr.className) + Color.grey("<") + Color.magenta(_attr.instanceID) + Color.grey(">");
        if (funcName && typeof funcName === 'string')
            errMsg += Color.grey(".") + Color.cyan(funcName.trim());
        errMsg += "\n" + Color.grey("-> ") + error.toString().trim();

        console.error(errMsg);
        throw error;
    } // SystemComponent#throw

    toString(funcName) {
        let str = `${_attr.className}<${_attr.instanceID}>`;
        if (funcName && typeof funcName === 'string')
            str += `.${funcName}`;
        return str;
    } // SystemComponent#toString

} // SystemComponent

module.exports = SystemComponent;