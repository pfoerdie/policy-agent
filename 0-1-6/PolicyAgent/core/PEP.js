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
    PDP = require('./PDP.js');

/**
 * @name _executeAction
 * @param TODO
 * @private
 * @async
 */
async function _executeAction() {
    // TODO
} // _executeAction

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
        this.data.actionDefinition = new Map();
        this.data.actionCallbacks = new Map();
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
            this.throw('request', new TypeError(`invalid argument`));
        if (typeof param !== 'object' || !param['action'] || !param['target'])
            this.throw('request', new TypeError(`invalid argument`));
        if (param && param['action'] && typeof param['action']['@id'] === 'string')
            param['action'] = param['action']['@id'];
        else if (typeof param['action'] !== 'string')
            this.throw('request', new Error(`invalid action`));
        if (!this.data.actionDefinition.has(param['action']))
            this.throw('request', new Error(`action unknown`));

        /**
         * @typedef {JSON} PEP~Request
         * @property {string} @type="PEP~Request"
         * @property {string} @id
         * @property {PEP~Action#id} action
         * @property {PEP~Action#id} [includedIn]
         * @property {PEP~Action#id[]} [implies]
         * @property {(PEP~Subject|PEP~Subject#@id)} target
         * @property {(PEP~Subject|PEP~Subject#@id)} [assignee]
         * @property {(PEP~Subject|PEP~Subject#@id)} [assigner]
         * 
         * @typedef {JSON} PEP~Subject
         * @property {string} @type
         * @property {string} [@id]
         */

        /** @type {Map<string, (PEP~Request|PEP~Subject)>} */
        const requestMap = new Map();

        (addRequest = (param) => {
            const
                requestID = `${param['action']}-${UUID()}`,
                actionDefinition = this.data.actionDefinition.get(param['action']),
                /** @type {PEP~Request} */
                request = Object.assign({
                    '@type': "PEP~Request",
                    '@id': requestID,
                    'target': param['target'],
                    'assigner': param['assigner'] || undefined,
                    'assignee': param['assignee'] || undefined
                }, actionDefinition);

            requestMap.set(requestID, request);

            // IDEA falls target/assigner/assignee eine @id besitzen, 
            // sollten sie referenziert und der requestMap hinzugefügt werden, 
            // um doppelten Load einzusparen

            if (actionDefinition.includedIn)
                addRequest(Object.assign({}, param, { 'action': actionDefinition.includedIn }));

            actionDefinition.implies.forEach(impl => addRequest(Object.assign({}, param, { 'action': impl })));
        })(param);

        const requestContext = {
            '@context': "PolicyAgent~RequestContext",
            '@graph': requestMap.entries().map(entry => entry[1])
        };

        // TODO

    } // PEP#request

    /**
     * @name PEP#defineAction
     * @param {string} actionName 
     * @param {string} includedIn 
     * @param {string[]} [implies=[]] 
     * @param {function} callback 
     */
    defineAction(actionName, callback, includedIn, implies = [], target = undefined) {
        if (!actionName || typeof actionName !== 'string')
            this.throw('defineAction', new TypeError(`invalid argument`));
        if (typeof callback !== 'function')
            this.throw('defineAction', new TypeError(`invalid argument`));
        if (this.data.actionDefinition.has(actionName))
            this.throw('defineAction', new Error(`'${actionName}' already defined`));
        if (actionName === 'use' || actionName === 'transfer') {
            includedIn = undefined;
            implies = [];
        } else if (!includedIn || typeof includedIn !== 'string')
            this.throw('defineAction', new TypeError(`invalid argument`));
        if (!Array.isArray(implies) || implies.some(elem => typeof elem !== 'string'))
            this.throw('defineAction', new TypeError(`invalid argument`));
        if (includedIn && !this.data.actionDefinition.has(includedIn))
            this.throw('defineAction', new Error(`includedIn unknown`));
        if (!implies.every(elem => this.data.actionDefinition.has(elem)))
            this.throw('defineAction', new Error(`implies unknown`));
        if (target !== 'undefined' && (!target || typeof target['@type'] !== 'string'))
            this.throw('defineAction', new Error(`invalid target`));;

        this.data.actionCallbacks.set(actionName, callback);
        this.data.actionDefinition.set(actionName, {
            action: actionName,
            includedIn, implies, target
        });

    } // PEP#defineAction

} // PEP

module.exports = PEP;