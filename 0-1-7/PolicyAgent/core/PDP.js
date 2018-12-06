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
    _enumerate = (obj, key, value) => Object.defineProperty(obj, key, { enumerable: true, value: value });

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

        this.data.PIP = typeof options['PIP'] === 'string'
            ? PolicyPoint.get(options['PIP'])
            : options['PIP'];
        if (!(this.data.PIP instanceof PIP))
            this.throw(undefined, new Error(`PIP invalid`));

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

        let
            environment = {},
            /** @type {ResponseContext} */
            responseContext = Object.create({}, {
                '@type': { enumerable: true, value: "ResponseContext" },
                '@id': { enumerable: true, value: UUID() },
                'responses': { enumerable: true, value: {} },
                'subjects': { enumerable: true, value: {} }
            }),
            defaultSubjects = {},
            /** @type {Array<PEP~Subject>} This array is used to require the subjects from the PIP. */
            requestSubjects = [],
            /** @type {Array<Array<[PEP~Request#id, string]>>} Required to coordinate the subjects for each request. */
            indexMatching = [],
            /** @type {Array<PIP~Subject>} This array contains all subjects found that were included in the requests. */
            responseSubjects,
            /** @type {Array<PAP~Record>} */
            applicablePolicies;

        /* 2. - retrieve requested subjects */

        for (let subjType of ['target', 'assigner', 'assignee']) {
            if (requestContext[subjType]) {
                requestSubjects.push(requestContext[subjType]);
                indexMatching.push([undefined, subjType]);
            }
        } // for

        for (let requestID in requestContext['requests']) {
            /* create response from each request */
            let
                request = requestContext['requests'][requestID],
                response = {};

            _enumerate(response, 'id', requestID);
            _enumerate(response, 'action', request['action']);

            /* add custom subjects if necessary */

            for (let subjType of ['target', 'assigner', 'assignee']) {
                if (request[subjType]) {
                    requestSubjects.push(request[subjType]);
                    indexMatching.push([requestID, subjType]);
                }
            } // for

            _enumerate(responseContext['responses'], requestID, response);
        } // for

        // responseSubjects = await this.data.PIP._retrieveSubjects(requestSubjects);
        responseSubjects = (await this.data.PIP._subjectRequest({ find: requestSubjects })).find;

        /* write subjects to the ResponseContext ... */
        indexMatching.forEach(([requestID, subjType], index) => {
            /** @type {PIP~Subject} */
            let subject = responseSubjects[index];

            if (!subject || !subject['uid'])
                return;

            if (!responseContext['subjects'][subject['uid']])
                _enumerate(responseContext['subjects'], subject['uid'], subject);

            _enumerate(requestID ? requestContext['requests'][requestID] : defaultSubjects, subjType, subject['uid']);
        });

        /* ... and all missing entries with the defaults */
        for (let requestID in responseContext['responses']) {
            let
                request = requestContext['requests'][requestID],
                response = responseContext['responses'][requestID];

            for (let subjType of ['target', 'assigner', 'assignee']) {
                if (!request[subjType] && defaultSubjects[subjType])
                    _enumerate(response, subjType, defaultSubjects[subjType]);
            } // for
        } // for

        /* 3. - retrieve Policies for the collected data in the responses */

        applicablePolicies = await this.data.PAP._retrievePolicies(
            Object.entries(responseContext['responses']).map(entry => entry[1])
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