/**
 * Policy Decision Point
 * @module PolicyAgent.PDP
 * @author Simon Petrac
 */

const
    PolicyPoint = require('./PolicyPoint.js'),
    _namespace = require('./namespace.js'),
    _enumerate = (obj, key, value) => Object.defineProperty(obj, key, { enumerable: true, value: value }),
    _define = (obj, key, value) => Object.defineProperty(obj, key, { value: value });

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
        _relationTypes = ['target'],
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
    found = (await this.data.PIP._find(find));

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
        if (resource && resource['uid'])
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
        _functionTypes = ['assigner', 'assignee'],
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
    found = (await this.data.PIP._find(find));

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
        if (subject && subject['uid'])
            _enumerate(responseContext['subject'], subject['uid'], subject);
    } // for

} // _gatherSubjects

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
        if (!(this.data.PAP instanceof _namespace.PAP))
            this.throw(undefined, new Error(`PAP invalid`));

        this.data.PIP = typeof options['PIP'] === 'string'
            ? PolicyPoint.get(options['PIP'])
            : options['PIP'];
        if (!(this.data.PIP instanceof _namespace.PIP))
            this.throw(undefined, new Error(`PIP invalid`));

    } // PDP.constructor

    /**
     * @name PDP#_decisionRequest
     * @param {RequestContext} requestContext
     * @async
     * 
     * INFO 7.17 Authorization decision:
     *   -> The PDP MUST return a response context, with one <Decision> element of value "Permit", "Deny", "Indeterminate" or "NotApplicable".
     *   => "Condition" muss zusätzlich aufgenommen werden, um Obligations einzuschließen
     */
    async _decisionRequest(requestContext) {
        if (!(requestContext instanceof _namespace.RequestContext))
            this.throw('_decisionRequest', new TypeError(`invalid argument`));

        /* 1. - create ResponseContext */

        const responseContext = new _namespace.ResponseContext(this, requestContext);
        this.log('_decisionRequest', "ResponseContext constructed");

        /* 2. - gather necessary resources and subjects */

        await Promise.all([
            _gatherResources.call(this, requestContext, responseContext),
            _gatherSubjects.call(this, requestContext, responseContext)
        ]);
        this.log('_decisionRequest', "gathering of subjects and resources completed");

        /* 3. - retrieve Policies for the collected data in the responses */

        let applicablePolicies = await this.data.PAP._retrievePolicies(
            Object.entries(responseContext['response']).map(entry => entry[1])
        );
        this.log('_decisionRequest', "collecting of applicable policies completed");

        for (let { 'id': requestID, 'result': policyArr } of applicablePolicies) {
            let
                response = responseContext['response'][requestID],
                // INFO "Permit" | "Deny" | "Condition" | "Indeterminate" | "NotApplicable"
                decision = policyArr.reduce((decision, policy) => {
                    if (decision === "NotApplicable" && policy['ruleType'] === 'permission')
                        return "Permit";
                    if (policy['ruleType'] === 'prohibition')
                        return "Deny";
                    /**
                     * NOTE Auf diese Weise gewinnt immer die Prohibition,
                     * was später durch ConflictTerm entschieden werden muss.
                     */
                    return decision;
                }, "NotApplicable");

            _enumerate(response, 'decision', decision);
        } // for

        _enumerate(responseContext, 'decision', responseContext['response'][responseContext['entryPoint']]['decision']);
        this.log('_decisionRequest', "decision assigned");

        // TODO für die transfer-Action müssen hier zusätzliche Methoden
        //      angehängt werden, je nachdem von welchem Typ das target ist.

        return responseContext;

    } // PDP#_decisionRequest

} // PDP

module.exports = PDP;