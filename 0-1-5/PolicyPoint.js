/**
 * @module PolicyAgent.PolicyPoint
 * @author Simon Petrac
 */

/**
 * NOTE The model operates by the following steps:
 *  1.  PAPs write policies and policy sets and make them available to the PDP.  
 *      These policies or policy sets represent the complete policy for a specified target.
 *  2.  The access requester sends a request for access to the PEP.
 *  3.  The PEP sends the request for access to the context handler in its native request format, 
 *      optionally including attributes of the subjects, resource, action, environment and other categories.
 *  4.  The context handler constructs an XACML request context, 
 *      optionally adds attributes, and sends it to the PDP.
 *  5.  The PDP requests any additional subject, resource, action, environment 
 *      and other categories (not shown) attributes from the context handler.
 *  6.  The context handler requests the attributes from a PIP.
 *  7.  The PIP obtains the requested attributes.
 *  8.  The PIP returns the requested attributes to the context handler.
 *  9.  Optionally, the context handler includes the resource in the context.
 *  10. The context handler sends the requested attributes and (optionally) the resource to the PDP.  
 *      The PDP evaluates the policy.
 *  11. The PDP returns the response context (including the authorization decision) to the context handler.
 *  12. The context handler translates the response context to the native response format of the PEP. 
 *      The context handler returns the response to the PEP.
 *  13. The PEP fulfills the obligations.
 *  14. (Not shown) If access is permitted, then the PEP permits access to the resource; otherwise, it denies access.
 * {@link http://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html#_Toc325047088 XACML Data-flow model}
 */

const
    UUID = require('uuid/v4'),
    Crypto = require('crypto'),
    Color = require('colors'),
    _private = new WeakMap(),
    _systemComponents = new Map();

//#region PolicyPoint

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
    constructor(options) {
        if (!new.target || new.target === PolicyPoint)
            throw new Error(`PolicyPoint is an abstract class`);

        let instanceID = (options && typeof options['@id'] === 'string') ? options['@id'] : UUID();

        _private.set(this, {
            targetClass: new.target,
            className: new.target.name,
            instanceID: instanceID,
            instanceName: Crypto.createHash('sha256').update(instanceID).digest('base64')
        });

        if (_systemComponents.has(instanceID))
            this.throw('constructor', `id '${instanceID}' already exists`);
        else
            _systemComponents.set(instanceID, this);

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

    } // PolicyPoint.constructor

    /**
     * The id of this instance. This value should be used with care.
     * @name PolicyPoint#id
     * @type {string}
     * @public
     * @readonly
     */
    get id() {
        return _private.get(this).instanceID;
    } // PolicyPoint#id<getter>

    /**
     * The sha256 hashed id of this instance. This value is suitable for public use.
     * @name PolicyPoint#name
     * @type {string}
     * @public
     * @readonly
     */
    get name() {
        return _private.get(this).instanceName;
    } // PolicyPoint#name<getter>

    /**
     * This function is used to log events on this component.
     * @name PolicyPoint#log
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
        error = (error instanceof Error) ? error : new Error(error.toString().trim());

        let errMsg = this.toString(funcName, true);
        errMsg += "\n" + Color.grey("-> ") + error.toString().trim();
        console.error(errMsg);

        throw error;
    } // PolicyPoint#throw

    /**
     * @name PolicyPoint#toString
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

    /**
     * TODO
     */
    static getComponent(instanceID) {
        let instance = _systemComponents.get(instanceID);
        return (instance && instance instanceof this) ? instance : undefined;
    } // PolicyPoint#getComponent

} // PolicyPoint

//#endregion PolicyPoint

module.exports = PolicyPoint;