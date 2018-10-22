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
 * @name RequestContext
 * @extends PolicyAgent.Auditor
 */
class RequestContext extends Auditor {
    /**
     * @typedef RequestContext~Request
     * @property {JSON-LD} action
     * @property {object} subject
     * @property {JSON-LD} subject.target
     * @property {JSON-LD} [subject.assigner]
     * @property {JSON-LD} [subject.assignee]
     **
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

        this.entries = (Array.isArray(request) ? request : [request]).map((entry) => {
            if (!entry || typeof entry !== 'object')
                return undefined;

            // validate entry.action
            if (typeof entry.action === 'string')
                entry.action = { '@id': entry.action, id: entry.action };
            else if (typeof entry.action !== 'object' || typeof entry.action['@id'] !== 'string')
                return undefined;

            // validate entry.subject
            if (typeof entry.subject !== 'object' || !entry.subject.target)
                return undefined;
            if (Object.entries(entry.subject).some(([subjName, subject]) => !subject || typeof subject !== 'object' || typeof subject['@type'] !== 'string'))
                return undefined;

            return {
                action: entry.action,
                subject: Object.assign({}, entry.subject) // important 
            };
        });

        if (!this.entries.every(elem => elem))
            this.throw('constructor', new TypeError(`invalid argument`));

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
            request: requestContext
        });

        this.entries = [];
        this.resource = {};
        // this.environment = {};
        this.decision = "NotApplicable";

        this.log(undefined, `constructed from ${requestContext.toString(undefined, true)}`);
    } // ResponseContext.constructor

} // ResponseContext

exports.Request = RequestContext;
exports.Response = ResponseContext;