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
 */
class PDP extends PolicyPoint {
    /**
     * @constructs PDP
     * @param {JSON} [options={}]
     * @abstract
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.administrationPoint = null;
        this.data.informationPoint = null;

    } // PDP.constructor

    /**
     * Adds a PIP to retrieve information.
     * @name PDP#connectPIP
     * @param {PolicyAgent.PIP} informationPoint 
     */
    connectPIP(informationPoint) {
        if (!(informationPoint instanceof PIP))
            this.throw('connectPIP', new TypeError(`invalid argument`));
        if (this.data.informationPoint)
            this.throw('connectPIP', `AttributeStore already connected`);

        this.data.informationPoint = informationPoint;
        this.log('connectPIP', `${informationPoint.toString(undefined, true)} connected`);
    } // PDP#connectPIP

    /**
     * Adds a PAP to retrieve policies.
     * @name PDP#connectPAP
     * @param {PolicyAgent.PAP} administrationPoint 
     */
    connectPAP(administrationPoint) {
        if (!(administrationPoint instanceof PAP))
            this.throw('connectPAP', new TypeError(`invalid argument`));
        if (this.data.administrationPoint)
            this.throw('connectPAP', `PAP already connected`);

        this.data.administrationPoint = administrationPoint;
        this.log('connectPAP', `${administrationPoint.toString(undefined, true)} connected`);
    } // PDP#connectPAP

    /**
     * @name PDP#_requestDecision
     * @param {PolicyAgent~RequestContext} requestContext
     * @async
     * 
     * INFO 7.17 Authorization decision:
     *   -> The PDP MUST return a response context, with one <Decision> element of value "Permit", "Deny", "Indeterminate" or "NotApplicable".
     */
    async _requestDecision(requestContext) {
        if (!PolicyPoint.validate('PolicyAgent~RequestContext', requestContext))
            this.throw('_requestDecision', new TypeError(`invalid argument`));

        if (!this.data.informationPoint)
            this.throw('_requestDecision', new Error(`informationPoint not connected`));
        if (!this.data.administrationPoint)
            this.throw('_requestDecision', new Error(`administrationPoint not connected`));

        /* 1. - create ResponseContext */

        let
            environment = {},
            /** @type {PolicyAgent~ResponseContext} */
            responseContext = Object.create({}, {
                '@type': { enumerable: true, value: "ResponseContext" },
                '@id': { enumerable: true, value: UUID() },
                'responses': { enumerable: true, value: {} },
                'subjects': { enumerable: true, value: {} }
            }),
            defaultSubjects = {},
            /** @type {Array<PolicyAgent.PEP~Subject>} This array is used to require the subjects from the PIP. */
            requestSubjects = [],
            /** @type {Array<Array<[PolicyAgent.PEP~Request#id, string]>>} Required to coordinate the subjects for each request. */
            indexMatching = [],
            /** @type {Array<PolicyAgent.PIP~Subject>} This array contains all subjects found that were included in the requests. */
            responseSubjects,
            /** @type {Array<PolicyAgent.PAP~Record>} */
            policySet;

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
                response = {
                    '@id': requestID
                };

            /* add custom subjects if necessary */

            for (let subjType of ['target', 'assigner', 'assignee']) {
                if (request[subjType]) {
                    requestSubjects.push(request[subjType]);
                    indexMatching.push([requestID, subjType]);
                }
            } // for

            _enumerate(responseContext['responses'], requestID, response);
        } // for

        responseSubjects = await this.data.informationPoint._retrieveSubjects(requestSubjects);

        /* write subjects to the ResponseContext ... */
        indexMatching.forEach(([requestID, subjType], index) => {
            /** @type {PolicyAgent.PIP~Subject} */
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

        policySet = await this.data.administrationPoint._requestPolicies(responseContext['responses']);

        // TODO

        return responseContext;

    } // PDP#_requestDecision

    /**
     * TODO
     */
    async _finalizeRequest(responseContext) {
        // TODO
    } // PDP#_finalizeRequest

} // PDP

module.exports = PDP;