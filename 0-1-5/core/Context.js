/**
 * Context
 * @module PolicyAgent.Context
 * @author Simon Petrac
 * 
 * INFO
 * Any Context instance shall never be revealed to the public as it is.
 */

const
    Auditor = require('./Auditor.js'),
    Action = require('./Action.js'),
    Resource = require('./Resource.js'),
    Subject = require('./Subject.js'),
    _private = new WeakMap();

/**
 * @name RequestContext
 * @extends PolicyAgent.Auditor
 */
class RequestContext extends Auditor {
    /**
     * @constructs RequestContext
     * @param {Session} session
     * @param {JSON} param
     * @package
     */
    constructor(session, param) {
        super();

        if (!session || typeof session !== 'object' || typeof session.id !== 'string')
            this.throw('constructor', new TypeError(`invalid argument`));
        if (!param || typeof param !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));

        _private.set(this, {
            session: session
        });

        Object.defineProperties(this, {
            /**
             * INFO XACML request.action:
             * -> An operation on a resource
             */
            action: {
                enumerable: true,
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
                enumerable: true,
                value: {}
            },
            /**
             * INFO XACML request.resource:
             * -> Data, service or system component
             */
            resource: {
                enumerable: true,
                value: {}
            },
            /**
             * INFO XACML request.environment:
             * -> The set of attributes that are relevant to an authorization decision 
             *    and are independent of a particular subject, resource or action
             */
            environment: {
                enumerable: true,
                value: {}
            }
        });

        for (let key in param) {
            if (key === 'action') {
                let action = param[key];

                if (typeof action === 'string')
                    this.action['@id'] = action;
                else if (action && typeof action === 'object' && typeof action['@id'] === 'string')
                    Object.assign(this.action, action);
            } else {
                let subject = param[key];

                if (subject && typeof subject === 'object' && typeof subject['@type'] === 'string')
                    Object.defineProperty(this.subjects, key, {
                        enumerable: true,
                        get: () => subject,
                        set: (value) => {
                            if (
                                value && typeof value === 'object' && subject['@type'] === value['@type'] &&
                                (subject['@id'] === value['@id'] || (!subject['@id'] && typeof value['@id'] === 'string'))
                            )
                                subject = value;
                        }
                    });
            } // if
        } // transfer param to this.action and this.subjects

        if (!this.action['@id'])
            this.throw('constructor', new Error(`invalid action`));
        if (!this.subjects['target'])
            this.throw('constructor', new Error(`invalid target`));

        // this.log(undefined, `constructed from Session<${session.id}>`); // TODO ist der toString-call save?
        this.log(undefined, `constructed from ${Auditor.prototype.toString.call(session, undefined, true)}`);
    } // RequestContext.constructor

} // RequestContext

/**
 * @name ResponseContext
 * @extends PolicyAgent.Auditor
 */
class ResponseContext extends Auditor {
    /**
     * @constructs ResponseContext
     * @param {RequestContext} requestContext
     * @param {JSON} param
     * @package
     */
    constructor(requestContext, param) {
        super();

        if (!(requestContext instanceof RequestContext))
            this.throw('constructor', new TypeError(`invalid argument`));

        _private.set(this, {
            session: _private.get(requestContext).session,
            decision: null
        });

        Object.defineProperties(this, {

        });

        this.log(undefined, `constructed from ${requestContext}`);
    } // ResponseContext.constructor

    /**
     * @name ResponseContext#decision
     * @type {(string|null)} 
     */
    get decision() {
        return _private.get(this).decision;
    } // ResponseContext#decision<getter>

    set decision(value) {
        const _attr = _private.get(this);

        if (_attr.decision)
            this.throw('decision', new Error("already set"));
        if (typeof value !== 'string')
            this.throw('decision', new TypeError(`invalid argument`));

        _attr.decision = value;
        this.log('decision', value);
    } // ResponseContext#decision<setter>

} // ResponseContext

exports.Request = RequestContext;
exports.Response = ResponseContext;