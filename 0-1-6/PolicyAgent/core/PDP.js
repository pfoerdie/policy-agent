/**
 * Policy Decision Point
 * @module PolicyAgent.PDP
 * @author Simon Petrac
 */

const
    PolicyPoint = require('./PolicyPoint.js'),
    PIP = require('./PIP.js'),
    PAP = require('./PAP.js');

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

        let
            environment = {},
            /** @type {PolicyAgent~ResponseContext} */
            responseContext = Object.create({}, {
                '@type': {
                    enumerable: true,
                    value: "PolicyAgent~ResponseContext"
                },
                'responses': {
                    enumerable: true,
                    value: {}
                },
                'subjects': {
                    enumerable: true,
                    value: {}
                }
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

        for (let subjType of ['target', 'assigner', 'assignee']) {
            if (requestContext[subjType]) {
                requestSubjects.push(requestContext[subjType]);
                indexMatching.push([undefined, subjType]);
            }
        } // for

        for (let requestID in requestContext['requests']) {
            let
                request = requestContext['requests'][requestID],
                response = {
                    '@id': requestID
                };

            for (let subjType of ['target', 'assigner', 'assignee']) {
                if (request[subjType]) {
                    requestSubjects.push(request[subjType]);
                    indexMatching.push([requestID, subjType]);
                }
            } // for

            Object.defineProperty(responseContext['responses'], requestID, {
                enumerable: true,
                value: response
            });
        } // for

        responseSubjects = await this.data.informationPoint._retrieveSubjects(requestSubjects);

        indexMatching.forEach(([requestID, subjType], index) => {
            /** @type {PolicyAgent.PIP~Subject} */
            let subject = responseSubjects[index];

            if (!subject || !subject['uid'])
                return;

            if (!responseContext['subjects'][subject['uid']])
                Object.defineProperty(responseContext['subjects'], subject['uid'], {
                    enumerable: true,
                    value: subject
                });

            Object.defineProperty(requestID ? requestContext['requests'][requestID] : defaultSubjects, subjType, {
                enumerable: true,
                value: subject['uid']
            });
        });

        for (let requestID in responseContext['responses']) {
            let
                request = requestContext['requests'][requestID],
                response = responseContext['responses'][requestID];

            for (let subjType of ['target', 'assigner', 'assignee']) {
                if (!request[subjType] && defaultSubjects[subjType]) {
                    Object.defineProperty(response, subjType, {
                        enumerable: true,
                        value: defaultSubjects[subjType]
                    });
                }
            } // for
        } // for

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