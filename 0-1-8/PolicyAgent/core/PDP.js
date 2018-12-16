/**
 * Policy Decision Point
 * @module PolicyAgent.PDP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    PolicyPoint = require('./PolicyPoint.js'),
    PIP = require('./PIP.js'),
    PAP = require('./PAP.js'),
    _enumerate = (obj, key, value) => Object.defineProperty(obj, key, { enumerable: true, value: value }),
    _relationTypes = ['target'],
    _functionTypes = ['assigner', 'assignee'];

/**
 * Gathers all resources necessary for the request and adds them to the responseContext.
 * @name _gatherResources
 * @param {RequestContext} requestContext 
 * @param {ResponseContext} responseContext 
 * @async
 * @private
 */
async function _gatherResources(requestContext, responseContext) {
    let
        /** @type {Array<PEP~Resource>} This array is used to require the resources from the PIP. */
        find = [],
        found = undefined,
        matching = {},
        $default = Symbol();

    for (let type of _relationTypes) {
        matching[type] = {};
        if (requestContext[type]) {
            matching[type][$default] = find.length;
            find.push(requestContext[type]);
        }
    } // for

    for (let requestID in requestContext['request']) {
        let request = requestContext['request'][requestID];
        for (let type of _relationTypes) {
            if (request[type]) {
                matching[type][requestID] = find.length;
                find.push(request[type]);
            }
        } // for
    } // for

    // NOTE multiple PIPs can be handled here
    found = (await this.data.rPIP._find(find));

    for (let type of _relationTypes) {
        let defaultIndex = matching[type][$default];

        for (let requestID in responseContext['response']) {
            let resource, currentIndex = matching[type][requestID];

            if (currentIndex !== undefined)
                resource = found[currentIndex];
            if (!resource && defaultIndex !== undefined)
                resource = found[defaultIndex];

            if (resource)
                _enumerate(responseContext['response'][requestID], type, resource['uid']);
        } // for
    } // for

    for (let resource of found) {
        if (resource)
            _enumerate(responseContext['resource'], resource['uid'], resource);
    } // for

} // _gatherResources

/**
 * Gathers all subjects necessary for the request and adds them to the responseContext.
 * @name _gatherSubjects
 * @param {RequestContext} requestContext 
 * @param {ResponseContext} responseContext 
 * @async
 * @private
 */
async function _gatherSubjects(requestContext, responseContext) {
    let
        /** @type {Array<PEP~Subject>} This array is used to require the subjects from the PIP. */
        find = [],
        found = undefined,
        matching = {},
        $default = Symbol();

    for (let type of _functionTypes) {
        matching[type] = {};
        if (requestContext[type]) {
            matching[type][$default] = find.length;
            find.push(requestContext[type]);
        }
    } // for

    for (let requestID in requestContext['request']) {
        let request = requestContext['request'][requestID];
        for (let type of _functionTypes) {
            if (request[type]) {
                matching[type][requestID] = find.length;
                find.push(request[type]);
            }
        } // for
    } // for

    // NOTE multiple PIPs can be handled here
    found = (await this.data.sPIP._find(find));

    for (let type of _functionTypes) {
        let defaultIndex = matching[type][$default];

        for (let requestID in responseContext['response']) {
            let subject, currentIndex = matching[type][requestID];

            if (currentIndex !== undefined)
                subject = found[currentIndex];
            if (!subject && defaultIndex !== undefined)
                subject = found[defaultIndex];

            if (subject)
                _enumerate(responseContext['response'][requestID], type, subject['uid']);
        } // for
    } // for

    for (let subject of found) {
        _enumerate(responseContext['subject'], subject['uid'], subject);
    } // for

} // _gatherSubjects

/**
 * Gathers all promises regarding the request.
 * @name _gatherPromises
 * @param {RequestContext} requestContext 
 * @param {ResponseContext} responseContext 
 * @async
 * @private
 */
async function _gatherPromises(requestContext, responseContext) {

    // TODO

} // _gatherPromises

/**
 * @name PDP
 * @extends PolicyAgent.PolicyPoint
 * @class
 */
class PDP extends PolicyPoint {
    /**
     * @constructs PDP
     * @param {JSON} [options={}]
     * @param {string} options.PAP
     * @param {string} options.PIP
     * @abstract
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.PAP = typeof options['PAP'] === 'string'
            ? PolicyPoint.get(options['PAP'])
            : options['PAP'];
        if (!(this.data.PAP instanceof PAP))
            this.throw(undefined, new Error(`PAP invalid`));

        this.data.rPIP = typeof options['rPIP'] === 'string'
            ? PolicyPoint.get(options['rPIP'])
            : options['rPIP'];
        if (!(this.data.rPIP instanceof PIP))
            this.throw(undefined, new Error(`resource-PIP invalid`));

        this.data.sPIP = typeof options['sPIP'] === 'string'
            ? PolicyPoint.get(options['sPIP'])
            : options['sPIP'];
        if (!(this.data.sPIP instanceof PIP))
            this.throw(undefined, new Error(`subject-PIP invalid`));

        this.data.ePIP = typeof options['ePIP'] === 'string'
            ? PolicyPoint.get(options['ePIP'])
            : options['ePIP'];
        if (!(this.data.ePIP instanceof PIP))
            this.throw(undefined, new Error(`environment-PIP invalid`));


    } // PDP.constructor

    /**
     * @name PDP#_decisionRequest
     * @param {RequestContext} requestContext
     * @async
     * 
     * INFO 7.17 Authorization decision:
     *   -> The PDP MUST return a response context, with one <Decision> element of value "Permit", "Deny", "Indeterminate" or "NotApplicable".
     */
    async _decisionRequest(requestContext) {
        if (!PolicyPoint.validate('RequestContext', requestContext))
            this.throw('_decisionRequest', new TypeError(`invalid argument`));

        /* 1. - create ResponseContext */

        /** @type {ResponseContext} */
        const responseContext = {};

        _enumerate(responseContext, '@type', "ResponseContext");
        _enumerate(responseContext, 'id@', UUID());
        _enumerate(responseContext, 'response', {});
        _enumerate(responseContext, 'subject', {});
        _enumerate(responseContext, 'resource', {});
        _enumerate(responseContext, 'environment', {});

        for (let requestID in requestContext['request']) {
            /* create response from each request */
            let
                request = requestContext['request'][requestID],
                response = {};

            _enumerate(response, 'id', requestID);
            _enumerate(response, 'action', request['action']);

            _enumerate(responseContext['response'], requestID, response);
        } // for

        /* 2. - gather necessary resources and subjects */

        await Promise.all([
            _gatherResources.call(this, requestContext, responseContext),
            _gatherSubjects.call(this, requestContext, responseContext)
        ]);

        /* 3. - retrieve Policies for the collected data in the responses */

        let whatever = _gatherPromises.call(this, requestContext, responseContext);
        // TODO

        applicablePolicies = await this.data.PAP._retrievePolicies(
            Object.entries(responseContext['response']).map(entry => entry[1])
        );

        // TODO

        return responseContext;

    } // PDP#_decisionRequest

    /**
     * TODO
     */
    async _finalizeRequest(responseContext) {
        // TODO
    } // PDP#_finalizeRequest

} // PDP

module.exports = PDP;