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
    _private = new WeakMap();

/**
 * @typedef RequestContext~Request
 * @property {JSON-LD} action
 * @property {object} subject
 * @property {JSON-LD} subject.target
 * @property {JSON-LD} [subject.assigner]
 * @property {JSON-LD} [subject.assignee]
 **
 * @name validateRequestArgument
 * @param {RequestContext~Request} request 
 * @returns {boolean}
 */
function validateRequestArgument(request) {
    if (!request || typeof request !== 'object')
        return false;

    // validate request.action
    if (typeof request.action === 'string')
        request.action = { '@id': request.action };
    else if (typeof request.action !== 'object' || typeof request.action['@id'] !== 'string')
        return false;
    request.action.id = request.action['@id'];

    // validate request.subject
    if (typeof request.subject !== 'object' || !request.subject.target)
        return false;
    for (let [subjName, subject] of Object.entries(request.subject)) {
        if (typeof subject !== 'object' || subject['@type'] !== 'string')
            return false;
    }

    return true;
} // validateRequestArgument

/**
 * @name RequestContext
 * @extends PolicyAgent.Auditor
 */
class RequestContext extends Auditor {
    /**
     * @constructs RequestContext
     * @param {Session} session
     * @param {(RequestContext~Request|RequestContext~Request[])} request
     * @package
     */
    constructor(session, request) {
        super();

        if (session instanceof RequestContext || session instanceof ResponseContext) // TODO validieren -> geht das mit dem ResponseContext?
            session = _private.get(session).session;
        else if (!session || typeof session !== 'object' || typeof session.id !== 'string')
            this.throw('constructor', new TypeError(`invalid argument`));
        if (Array.isArray(request) ? !request.every(validateRequestArgument) : !validateRequestArgument(request))
            this.throw('constructor', new TypeError(`invalid argument`));

        /**
         * INFO XACML request.action:
         * -> An operation on a resource
         * INFO XACML request.subject:
         *  -> An actor whose attributes may be referenced by a predicate
         *     (Predicate := A statement about attributes whose truth can be evaluated)
         * NOTE The relation and the function property of the ODRL will be combined into
         *      this single subjects property of XACML.
         * NOTE To handle multiple requests simultanously, request.entries contains the different actions and subjects
         * INFO XACML request.resource:
         * -> Data, service or system component
         * INFO XACML request.environment:
         * -> The set of attributes that are relevant to an authorization decision 
         *    and are independent of a particular subject, resource or action
         */

        this.entries = Array.isArray(request) ? request : [request];
        this.resource = {};
        this.environment = {};

        _private.set(this, { session });

        // this.log(undefined, `constructed from Session<${session.id}>`); // TODO ist der toString-call save?
        this.log(undefined, `constructed from ${Auditor.prototype.toString.call(session, undefined, true)}`);
    } // RequestContext.constructor

} // RequestContext

/**
 * @name ResponseContext
 * @extends PolicyAgent.Auditor
 */
class ResponseContext extends Auditor {
    /** ResponseContext.constructor *
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

        this.log(undefined, `constructed from ${requestContext.toString(undefined, true)}`);
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