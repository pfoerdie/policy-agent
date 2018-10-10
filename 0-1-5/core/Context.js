/**
 * Context
 * @module PolicyAgent.Context
 * @author Simon Petrac
 */

const
    Auditor = require('./Auditor.js'),
    _private = new WeakMap();

/**
 * @name Context
 * @extends PolicyAgent.Auditor
 * 
 * INFO
 * Any Context instance shall never be revealed to the public as it is.
 */
class Context extends Auditor {
    /**
     * @constructs Context
     * @param {Session} session
     * @param {JSON} subject
     * @package
     */
    constructor(session, param) { // IDEA ...args hinzufügen, als Parameter für die Aktion später (zB um Request/Response zu übergeben)
        super();

        if (!session || typeof session !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));
        if (!param || typeof param !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));

        _private.set(this, {
            session: session,
            decision: null
        });

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

} // Context

module.exports = Context;