/**
 * Policy Execution Point
 * @module PolicyAgent.PEP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    ExpressSession = require('express-session'),
    SessionMemoryStore = require('session-memory-store')(ExpressSession),
    PolicyPoint = require('./PolicyPoint.js'),
    Auditor = require('./Auditor.js'),
    RequestContext = require('./Context.js').Request,
    PDP = require('./PDP.js'),
    _private = new WeakMap();

/**
 * @name Action
 * @extends PolicyAgent.Auditor
 */
class Action extends Auditor {
    /**
     * @constructs Action
     * @param {string} actionName 
     * @param {string} includedIn 
     * @param {string[]} implies
     * @param {function} callback 
     * @private
     */
    constructor(actionName, includedIn, implies, callback) {
        super(actionName);

        if (!actionName || typeof actionName !== 'string')
            this.throw('constructor', new TypeError(`invalid argument`));
        if (actionName === 'use' || actionName === 'transfer') {
            includedIn = undefined;
            implies = [];
        } else if (typeof includedIn !== 'string')
            this.throw('constructor', new TypeError(`invalid argument`));
        if (!Array.isArray(implies) || implies.some(elem => typeof elem !== 'string'))
            this.throw('constructor', new TypeError(`invalid argument`));
        if (typeof callback !== 'function')
            this.throw('constructor', new TypeError(`invalid argument`));

        Object.defineProperties(this, {
            id: {
                enumerable: true,
                value: actionName
            },
            includedIn: {
                enumerable: true,
                value: includedIn
            },
            implies: {
                enumerable: true,
                value: implies
            }
        });

        _private.set(this, { callback });

    } // Action.constructor

} // Action

/**
 * @name PEP
 * @extends PolicyAgent.PolicyPoint
 */
class PEP extends PolicyPoint {
    /**
     * @constructs PEP
     * @param {JSON} [options={}]
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.sessionMaxAge = 60 * 60 * 24 * 7;

        this.data.sessionStore = new SessionMemoryStore({
            expires: this.data.sessionMaxAge
        });

        this.data.decisionPoints = new Set();

        this.data.actions = new Map([
            ['use', new Action('use', undefined, undefined, (/* TODO */) => { /* TODO */ })],
            ['transfer', new Action('transfer', undefined, undefined, (/* TODO */) => { /* TODO */ })]
        ]);
    } // PEP.constructor

    /**
     * Adds a PDP to resolve decision request.
     * @name PEP#connectPDP
     * @param {PolicyAgent.PDP} decisionPoint 
     */
    connectPDP(decisionPoint) {
        if (!(decisionPoint instanceof PDP))
            this.throw('connectPDP', new TypeError(`invalid argument`));
        if (this.data.decisionPoints.has(decisionPoint))
            this.throw('connectPDP', new Error(`decisionPoint already connected`));

        this.data.decisionPoints.add(decisionPoint);

        this.log('connectPDP', `${decisionPoint.toString(undefined, true)} connected`);
    } // PEP#connectPDP

    /**
     * @name PEP#request
     * @param {Session} session
     * @param {JSON} param
     * @returns {*}
     * @async
     */
    async request(session, param) {
        const request = {
            actions: [],
            subjects: {}
        };

        for (let key in param) {
            if (key === 'action') {
                let action = param[key];

                if (typeof action === 'string')
                    request.actions.push({
                        '@id': action
                    });
                else if (action && typeof action === 'object' && typeof action['@id'] === 'string')
                    request.actions.push(action);
            } else {
                let subject = param[key];

                if (subject && typeof subject === 'object' && typeof subject['@type'] === 'string')
                    request.subjects[key] = subject;
            } // if
        } // transfer param to request.actions and request.subjects

        // TODO fehlende Subjects aus der Session holen und in request speichern (z.B. assignee)

        if (!request.actions.length === 0)
            this.throw('constructor', new Error(`invalid action`));
        if (!request.subjects['target'])
            this.throw('constructor', new Error(`invalid target`));

        // TODO includedIn und implied actions hinzufügen

        let promiseArr = [];
        this.data.decisionPoints.forEach(decisionPoint => promiseArr.push(
            (async () => {
                try {
                    let
                        requestContext = new RequestContext(session, request),
                        /** @type {PolicyAgent.Context.Response} */
                        responseContext = await decisionPoint._requestDecision(requestContext);

                    return [null, responseContext];
                } catch (err) {
                    // NOTE debugging point
                    return [err];
                }
            })(/* INFO call the async function immediately to get a promise */)
        ));

        let resultArr = await Promise.all(promiseArr);
        resultArr = resultArr.filter(([err, responseContext]) => !err && responseContext !== "NotApplicable" && responseContext !== "Indeterminate");

        if (resultArr.length === 0)
            this.throw('request', new Error(`failed to resolve`));

        /**
         * INFO 7.2.1 Base PEP
         * - If the decision is "Permit", then the PEP SHALL permit access.  
         *   If obligations accompany the decision, then the PEP SHALL permit access only if it understands and it can and will discharge those obligations.
         * - If the decision is "Deny", then the PEP SHALL deny access.
         *   If obligations accompany the decision, then the PEP shall deny access only if it understands, and it can and will discharge those obligations.
         * - If the decision is “NotApplicable”, then the PEP’s behavior is undefined.
         * - If the decision is “Indeterminate”, then the PEP’s behavior is undefined.
         */

        // TODO Auswahl des ResponseContexts
        // TODO Aktionen ausführen (Deny-biased PEP vs Permit-biased PEP)
        // TODO Rückgabewert feststellen

    } // PEP#request

    /**
     * @name PEP#defineAction
     * @param {string} actionName 
     * @param {string} includedIn 
     * @param {string[]} [implies=[]] 
     * @param {function} callback 
     */
    defineAction(actionName, includedIn, implies = [], callback) {
        if (this.data.actions.has(actionName))
            this.throw('defineAction', new Error(`'${actionName}' already defined`));

        const action = new Action(actionName, includedIn, implies, callback);
        // NOTE if arguments were invalid, Action.constructor would have thrown

        if (!this.data.actions.has(includedIn))
            this.throw('defineAction', new Error(`includedIn unknown`));
        if (!implies.every(elem => this.data.actions.has(elem)))
            this.throw('defineAction', new Error(`implies unknown`));

        this.data.actions.set(actionName, action);
    } // PEP#defineAction

} // PEP

module.exports = PEP;