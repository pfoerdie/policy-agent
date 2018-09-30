/**
 * Context
 * @module PolicyAgent.Context
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    Color = require('colors'),
    PolicyPoint = require('./PolicyPoint.js'),
    PEP = require('./PEP.js'),
    PDP = require('./PDP.js'),
    PIP = require('./PIP.js'),
    _private = new WeakMap(),
    _enum = {},
    _source = Symbol();

_enum.Decision = {
    Permit: 1,
    Deny: 2,
    Indeterminate: 3,
    NotApplicable: 4
};

_enum.Phase = {
    Initialization: 1,
    Enforcement: 2,
    Decision: 3,
    Execution: 4
};

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
    constructor(session, param) {
        _private.set(this, {
            instanceID: UUID(),
            phase: _enum.Phase.Initialization
        });

        if (!session || typeof session !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));
        if (!param || typeof param !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));

        Object.defineProperties(this, {
            attributes: {
                value: Object.create({}, {
                    /**
                     * NOTE XACML request.action:
                     * -> An operation on a resource
                     */
                    action: {
                        value: {}
                    },
                    /**
                     * NOTE 
                     * XACML suggests an attribute called subject.
                     * Due to variation to ODRL, this will be split into relation and target.
                     * NOTE XACML request.subject:
                     * -> An actor whose attributes may be referenced by a predicate
                     *    (Predicate := A statement about attributes whose truth can be evaluated)
                     */
                    relation: {
                        value: {}
                    },
                    function: {
                        value: {}
                    },
                    /**
                     * NOTE XACML request.resource:
                     * -> Data, service or system component
                     */
                    resource: {
                        value: {}
                    },
                    /**
                     * NOTE XACML request.environment:
                     * -> The set of attributes that are relevant to an authorization decision 
                     *    and are independent of a particular subject, resource or action
                     */
                    environment: {
                        value: {}
                    }
                })
            },
            data: {
                value: Object.create({}, {
                    session: {
                        value: session
                    },
                    missing: {
                        value: new Set()
                    },
                    cache: {
                        value: new Map()
                    },
                    /**
                     * NOTE 7.17 Authorization decision:
                     * -> The PDP MUST return a response context, with one <Decision> element of value "Permit", "Deny", "Indeterminate" or "NotApplicable".
                     */
                    decision: {
                        value: null,
                        writable: true
                    },
                    result: {
                        value: null,
                        writable: true
                    }
                })
            }
        });

        if (typeof param['action'] === 'string')
            this.attributes.action['@id'] = param['action'];
        else if (typeof param['action'] === 'object' && typeof param['action']['@id'] === 'string')
            Object.assign(this.attributes.action, param['action']);
        else
            this.throw('constructor', new Error(`invalid action`));

        if (typeof param['target'] === 'object')
            this.attributes.relation.target = param['target'];
        else
            this.throw('constructor', new Error(`invalid target`));

        if (typeof param['assignee'] === 'object')
            this.attributes.function.assignee = param['assignee'];
        if (typeof param['assigner'] === 'object')
            this.attributes.function.assigner = param['assigner'];

        // TODO this.attributes.resource ???
        // TODO this.attributes.environment ???

        this.log(undefined, `instantiated`);
    } // Context.constructor

    /**
     * @name Context#
     * @param {PolicyPoint} policyPoint 
     */
    async next(policyPoint) {
        const _attr = _private.get(this);

        switch (_attr.phase) {

            case _enum.Phase.Initialization:
                // TODO brauche ich  unbedingt this.attributes.resource.enforcement oder kann ich diese Phase streichen?
                if (policyPoint instanceof PEP) {
                    let enforcementPoint = policyPoint;

                    this.attributes.resource.enforcement = {
                        '@id': enforcementPoint.id
                    };

                    _attr.phase = _enum.Phase.Enforcement;
                    this.log(undefined, `enforcement phase entered`);
                } else
                    this.throw(new TypeError(`invalid argument`));
                break;

            case _enum.Phase.Enforcement:
                if (policyPoint instanceof PDP) {
                    let decisionPoint = policyPoint;

                    _attr.phase = _enum.Phase.Decision;
                    this.log(undefined, `decision phase entered`);

                    this.attributes.resource.decision = {
                        '@id': decisionPoint.id
                    };

                    try {
                        await decisionPoint._request(this);
                    } catch (err) {
                        _attr.phase = null;
                        throw err;
                    }

                    _attr.phase = _enum.Phase.Execution;
                    this.log(undefined, `execution phase entered`);
                } else
                    this.throw(new TypeError(`invalid argument`));
                break;

            case _enum.Phase.Decision:
                if (policyPoint instanceof PIP['AttributeStore']) {
                    let attributeStore = policyPoint;

                    let request = [];
                    this.data.missing.forEach((missingID, undefined, missingMap) => {
                        // TODO
                    });

                    let result = await attributeStore._retrieve(request);

                    // TODO
                } else
                    this.throw(new TypeError(`invalid argument`));
                break;

            case _enum.Phase.Execution:
                if (policyPoint instanceof PEP) {
                    let executionPoint = policyStore;

                    // TODO actions vom PEP holen und ausführen

                    _attr.phase = null;
                } else
                    this.throw(new TypeError(`invalid argument`));
                break;

            default:
                this.throw('next', new Error(`context deprecated`));

        } // switch
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
            ? Color.blue("Context") + Color.grey("<") + Color.magenta(_attr.instanceID) + Color.grey(">")
            : `${"Context"}<${_attr.instanceID}>`;

        if (funcName && typeof funcName === 'string')
            str += colored
                ? Color.grey(".") + Color.cyan(funcName.trim())
                : `.${funcName.trim()}`;

        return str;
    } // PolicyPoint#toString

    /**
     * The enumerations that this class uses.
     * @name Context.enum
     * @type {object}
     * @readonly
     */
    static get enum() {
        return _enum; // TODO überdenken
    } // Context.enum

} // Context

module.exports = Context;