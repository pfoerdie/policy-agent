/**
 * Auditor
 * @module PolicyAgent.Auditor
 * @author Simon Petrac
 */

const
    Color = require('colors'),
    UUID = require('uuid/v4'),
    _private = new WeakMap();

/**
 * @name Auditor
 */
class Auditor {
    /**
     * @constructs Auditor
     * @param {string} [id=UUID()] The id for auditing.
     * @package
     * @abstract
     */
    constructor(id) {
        _private.set(this, {
            name: new.target.name,
            id: id === undefined ? UUID() : typeof id === 'string' ? id : ""
        });
    } // Auditor.constructor

    /**
     * This function is used to log events on this component.
     * @name Auditor#log
     * @param {string} funcName The name of the function for this log entry.
     * @param {...(string|*)} messages If no string is submitted, the arguments will be used with the toString method.
     * @package
     */
    log(funcName, ...messages) {
        return Auditor.log.call(this, funcName, ...messages);
    } // Auditor#log

    /**
     * This function is used to log events.
     * @name Auditor.log
     * @param {string} funcName The name of the function for this log entry.
     * @param {...(string|*)} messages If no string is submitted, the arguments will be used with the toString method.
     * @package
     */
    static log(funcName, ...messages) {
        let logMsg = this.toString(funcName, true);
        for (let msg of messages) {
            logMsg += "\n" + Color.grey("-> ") + msg.toString().trim();
        }
        console.log(logMsg);
    } // Auditor.log

    /**
     * This function is used to log errors on this component. It will also throw an error.
     * @name Auditor#throw
     * @param {string} funcName The name of the function for this error entry.
     * @param {(Error|*)} error If no error is submitted, the arguments will be used to create an error.
     * @param {boolean} [silent=false] In silent-mode the error will be returned instead of thrown.
     * @throws {Error} Throws an error if not in silent-mode.
     * @package
     */
    throw(funcName, error, silent = false) {
        return Auditor.throw.call(this, funcName, error, silent);
    } // Auditor#throw

    /**
     * This function is used to log errors. It will also throw an error.
     * @name Auditor.throw
     * @param {string} funcName The name of the function for this error entry.
     * @param {(Error|*)} error If no error is submitted, the arguments will be used to create an error.
     * @param {boolean} [silent=false] In silent-mode the error will be returned instead of thrown.
     * @throws {Error} Throws an error if not in silent-mode.
     * @package
     */
    static throw(funcName, error, silent = false) {
        error = (error instanceof Error) ? error : new Error(error.toString().trim());

        let errMsg = this.toString(funcName, true);
        errMsg += "\n" + Color.grey("-> ") + error.toString().trim();
        console.error(errMsg);

        if (silent) return error;
        else throw error;
    } // Auditor.throw

    /**
     * @name Auditor#toString
     * @param {string} [funcName] The name of a function to include in the output.
     * @param {boolean} [colored=false] Weather the output should make use of colors.
     * @returns {string}
     * @override
     */
    toString(funcName, colored = false) {
        const _attr = _private.get(this);

        let
            className = _attr ? _attr.name : this.__proto__.constructor.name,
            instanceID = _attr ? _attr.id : this.id || this['@id'] || "";

        let str = colored
            ? Color.blue(className) + Color.grey("<") + Color.magenta(instanceID) + Color.grey(">")
            : `${className}<${instanceID}>`;

        if (funcName && typeof funcName === 'string')
            str += colored
                ? Color.grey(".") + Color.cyan(funcName.trim())
                : `.${funcName.trim()}`;

        return str;
    } // Auditor#toString

    /**
     * @name Auditor.toString
     * @param {string} [funcName] The name of a function to include in the output.
     * @param {boolean} [colored=false] Weather the output should make use of colors.
     * @returns {string}
     * @override
     */
    static toString(funcName, colored = false) {
        let
            className = this.constructor.name;

        let str = colored ? Color.blue(className) : `${className}`;

        if (funcName && typeof funcName === 'string')
            str += colored
                ? Color.grey(".") + Color.cyan(funcName.trim())
                : `.${funcName.trim()}`;

        return str;
    } // Auditor.toString

} // Auditor

module.exports = Auditor;