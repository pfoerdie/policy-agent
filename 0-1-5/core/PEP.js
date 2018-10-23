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
    Context = require('./Context.js'),
    PDP = require('./PDP.js');

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

        this.data.actions = new Map();
        this.defineAction('use', undefined, undefined, (/* TODO */) => {
            console.log(`action 'use' used`);
            return null;
        });
        this.defineAction('transfer', undefined, undefined, (/* TODO */) => {
            console.log(`action 'transfer' used`);
            return null;
        });
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
        if (!session || typeof session !== 'object' || typeof session.id !== 'string')
            this.throw('constructor', new TypeError(`invalid argument`));
        if (typeof param !== 'object' || !param['action'] || !param['target'])
            this.throw('constructor', new TypeError(`invalid argument`));
        if (typeof param['action'] === 'string')
            param['action'] = {
                '@id': param['action']
            };
        else if (typeof param['action']['@id'] !== 'string')
            this.throw('constructor', new Error(`invalid action`));
        if (!this.data.actions.has(param['action']['@id']))
            this.throw('constructor', new Error(`action unknown`));

        const
            requestSubject = {},
            requestEntries = [];

        Object.entries(param).forEach(([subjName, subject]) => {
            if (
                typeof subjName === 'string' && subjName !== 'action' &&
                subject && typeof subject === 'object' && typeof subject['@type'] === 'string'
            ) requestSubject[subjName] = subject;
        });

        const addEntry = (action, subject) => {
            // NOTE recursive, but should be determined
            // TODO check that
            const _action = this.data.actions.get(action['@id']);
            requestEntries.push({ action, subject });
            if (_action.includedIn && !requestEntries.includes(entry => _action.includedIn.id !== entry.action['@id']))
                addEntry({ '@id': _action.includedIn.id }, subject);
            _action.implies.forEach((implAction) => {
                if (!requestEntries.includes(entry => implAction.id !== entry.action['@id']))
                    addEntry({ '@id': implAction.id }, subject);
            });
        }; // addAction

        addEntry(param['action'], requestSubject);

        // TODO fehlende Subjects aus der Session holen (z.B. assignee)

        let
            promiseArr = [],
            responseContexts = [];

        this.data.decisionPoints.forEach(decisionPoint => promiseArr.push(
            (async () => {
                try {
                    let
                        requestContext = new Context.Request(session, requestEntries),
                        /** @type {PolicyAgent.Context.Response} */
                        responseContext = await decisionPoint._requestDecision(requestContext);

                    responseContexts.push(responseContext);
                } catch (err) {
                    // do nothing
                    // console.error(err);
                }
            })(/* NOTE call the async function immediately to get a promise */)
        ));

        await Promise.all(promiseArr);
        if (responseContexts.length === 0)
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

        // TODO Auswahl des richtigen ResponseContexts

        let context = responseContexts[0];

        const executeAction = async (action) => {
            let
                inclResult = action.includedIn ? await executeAction(action.includedIn) : undefined,
                implResult = await Promise.all(action.implies.map(implAction => executeAction(implAction))),
                implObj = {};

            action.implies.forEach((action, index) => { implObj[action.id] = implResult[index] });

            return await action.callback(undefined /* TODO hier muss eigentlich das zugehörige target aus den entries hin oder so!! */, inclResult, implObj);
        }; // executeAction

        // TODO bisher wird nur die Gesamtentscheidung berücksichtigt

        if (context.decision !== 'Permission')
            this.throw('request', new Error(`permission denied`));

        return await executeAction(this.data.actions.get(param['action']['@id']));


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
        if (!actionName || typeof actionName !== 'string')
            this.throw('defineAction', new TypeError(`invalid argument`));
        if (typeof callback !== 'function')
            this.throw('defineAction', new TypeError(`invalid argument`));
        if (this.data.actions.has(actionName))
            this.throw('defineAction', new Error(`'${actionName}' already defined`));
        if (actionName === 'use' || actionName === 'transfer') {
            includedIn = undefined;
            implies = [];
        } else if (!includedIn || typeof includedIn !== 'string')
            this.throw('defineAction', new TypeError(`invalid argument`));
        if (!Array.isArray(implies) || implies.some(elem => typeof elem !== 'string'))
            this.throw('defineAction', new TypeError(`invalid argument`));
        if (includedIn && !this.data.actions.has(includedIn))
            this.throw('defineAction', new Error(`includedIn unknown`));
        if (!implies.every(elem => this.data.actions.has(elem)))
            this.throw('defineAction', new Error(`implies unknown`));

        this.data.actions.set(actionName, {
            id: actionName,
            includedIn: includedIn ? this.data.actions.get(includedIn) : undefined,
            implies: implies.map(elem => this.data.actions.get(elem)),
            callback: callback
        });
    } // PEP#defineAction

} // PEP

module.exports = PEP;