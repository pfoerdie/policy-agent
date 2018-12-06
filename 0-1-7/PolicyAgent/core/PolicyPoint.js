/**
 * Policy Point
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
 * {@link https://www.oasis-open.org/committees/download.php/2713/Brief_Introduction_to_XACML.html A Brief Introduction to XACML}
 */

const
    UUID = require('uuid/v4'),
    Crypto = require('crypto'),
    Auditor = require('./Auditor.js'),
    _private = new WeakMap(),
    _policyPoints = new Map();

/**
 * This is the base class for every PolicyPoint.
 * @name PolicyPoint
 * @extends PolicyAgent.Auditor
 */
class PolicyPoint extends Auditor {
    /**
     * @constructs PolicyPoint
     * @param {object} options
     * @param {string} [options.@id=UUID()]
     * @package
     * @abstract
     */
    constructor(options) {
        if (!new.target || new.target === PolicyPoint)
            throw new Error(`PolicyPoint is an abstract class`);

        let instanceID = (options && typeof options['@id'] === 'string') ? options['@id'] : UUID();
        super(instanceID);

        if (!options || typeof options !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));

        if (_policyPoints.has(instanceID))
            this.throw('constructor', new Error(`id '${instanceID}' already exists`));
        else
            _policyPoints.set(instanceID, this);

        _private.set(this, {
            targetClass: new.target,
            instanceID: instanceID,
            instanceName: Crypto.createHash('sha256').update(instanceID).digest('base64')
        });

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
     * 
     * @param {string} type 
     * @param {*} value 
     */
    static validate(type, value) {
        switch (type) {

            case 'RequestContext':
                return value
                    && value['@type'] === type
                    && typeof value['requests'] === 'object';

            case 'ResponseContext':
                return value
                    && value['@type'] === type
                    && typeof value['responses'] === 'object';

            default:
                this.throw('validate', new Error(`unknown type`));

        } // switch
    } // PolicyPoint#validate

    /**
     * @name PolicyPoint.get
     * @param {string} instanceID
     * @returns {PolicyPoint}
     */
    static get(instanceID) {
        let instance = _policyPoints.get(instanceID);
        return (instance && instance instanceof this) ? instance : undefined;
    } // PolicyPoint.getComponent

} // PolicyPoint

module.exports = PolicyPoint;