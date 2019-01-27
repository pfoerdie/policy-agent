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
    _namespace = require('./namespace.js'),
    _enumerate = (obj, key, value) => Object.defineProperty(obj, key, { enumerable: true, value: value });

/**
 * @name _validateActionRequest
 * @param {ResponseContext} responseContext
 * @param {string} requestID
 * @returns {boolean} validity
 * @this {PEP}
 * @private
 */
function _validateActionRequest(responseContext, requestID) {

    // TODO

} // _validateActionRequest

/**
 * @name _executeActionRequest
 * @param {ResponseContext} responseContext
 * @param {string} requestID
 * @param {...*} args
 * @returns {*} result
 * @this {PEP}
 * @async
 * @private
 */
async function _executeActionRequest(responseContext, requestID, ...args) {

    let
        response = responseContext['response'][requestID],
        actionCB = this.data.actionCallbacks[response['action']],
        actionContext = {};

    // TODO obligations
    // IDEA validate und execute in einem?

    _enumerate(actionContext, 'includedIn', response['includedIn']
        ? (...includedInArgs) => _executeActionRequest.call(this, responseContext, response['includedIn'], ...includedInArgs)
        : () => responseContext['resource'][response['target']]);

    _enumerate(actionContext, 'implies', {});
    for (let tmp of response['implies']) {
        _enumerate(actionContext['implies'], action, (...impliesArgs) => _executeActionRequest.call(this, responseContext, response['implies'], ...impliesArgs));
    }

    // TODO die argumente für actionCB sind entscheidend
    let result = await actionCB.call(actionContext, /*session,*/ ...args);
    return result;

    // TODO

} // _executeActionRequest

async function _actionUse(target, impl, session) {
    return "USE";
} // _actionUse

async function _actionTransfer(args, impl, session) {
    return "TRANSFER";
} // _actionTransfer

/**
 * @name PEP
 * @extends PolicyAgent.PolicyPoint
 * @class
 */
class PEP extends PolicyPoint {
    /**
     * @constructs PEP
     * @param {JSON} [options={}]
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.PDP = typeof options['PDP'] === 'string'
            ? PolicyPoint.get(options['PDP'])
            : options['PDP'];
        if (!(this.data.PDP instanceof _namespace.PDP))
            this.throw(undefined, new Error(`PDP invalid`));

        this.data.sessionMaxAge = 60 * 60 * 24 * 14; // default: 14 days
        this.data.sessionStore = new SessionMemoryStore({
            expires: this.data.sessionMaxAge
        });

        this.data.actionDefinition = new Map();
        this.data.actionCallbacks = new Map();

        this.defineAction('use', _actionUse.bind(this));
        this.defineAction('transfer', _actionTransfer.bind(this));
    } // PEP.constructor

    async generateSession() {

    } // generateSession

    /**
     * @name PEP#request
     * @param {string} sessionID
     * @param {JSON} param
     * @param {...*} args
     * @returns {*}
     * @async
     */
    async request(sessionID, param, ...args) {
        sessionID.save();
        sessionID = sessionID.id; // TODO

        if (!sessionID || typeof sessionID !== 'string')
            this.throw('request', new TypeError(`invalid argument`));
        if (!param || typeof param !== 'object')
            this.throw('request', new TypeError(`invalid argument`));
        if (!param['target'] || typeof param['target']['@type'] !== 'string')
            this.throw('request', new Error(`invalid target`));
        if (param['action'] && typeof param['action']['@id'] === 'string')
            param['action'] = param['action']['@id'];
        else if (typeof param['action'] !== 'string')
            this.throw('request', new Error(`invalid action`));
        if (!this.data.actionDefinition.has(param['action']))
            this.throw('request', new Error(`action unknown`));

        // gr0ßes TODO: wie mache ich das mit den Sessions?

        // await new Promise((resolve, reject) => {
        //     this.data.sessionStore.set(session.id, session, (err) => {
        //         if (err) reject(err);
        //         else resolve();
        //     });
        // });

        const session = await new Promise((resolve, reject) => {
            this.data.sessionStore.get(sessionID, (err, result) => {
                if (err)
                    return reject(err);

                if (result)
                    resolve(result);
                else
                    this.data.sessionStore.set(sessionID, {}, (err) => {
                        if (err)
                            return reject(err);

                        this.data.sessionStore.get(sessionID, (err, result) => {
                            if (err)
                                return reject(err);

                            if (result)
                                resolve(result);
                            else
                                resolve();
                        });
                    });
            });
        });

        /* 1. - create RequestContext */

        let requestContext = new _namespace.RequestContext(this, session, param);

        /* 2. - send RequestContext to PDP#_decisionRequest */

        let responseContext = await this.data.PDP._decisionRequest(requestContext);
        let entryPoint = requestContext['entryPoint'];

        /* 3. - execute Actions */

        if (!_validateActionRequest.call(this, responseContext, entryPoint))
            this.throw('request', new Error("request denied"));

        let result = await _executeActionRequest.call(this, responseContext, entryPoint, ...args);
        return result;

    } // PEP#request

    /**
     * @name PEP#defineAction
     * @param {string} actionName 
     * @param {function} callback 
     * @param {string} includedIn 
     * @param {string[]} [implies=[]] 
     */
    defineAction(actionName, callback, includedIn, implies = []
        // , target = undefined, assigner = undefined, assignee = undefined
    ) {

        // TODO überarbeiten!

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
        // if (target && typeof target['@type'] !== 'string')
        //     this.throw('defineAction', new Error(`invalid target`));
        // if (assigner && typeof assigner['@type'] !== 'string')
        //     this.throw('defineAction', new Error(`invalid assigner`));
        // if (assignee && typeof assignee['@type'] !== 'string')
        //     this.throw('defineAction', new Error(`invalid assignee`));

        // let topLvlAction = includedIn;
        // while (topLvlAction !== 'use' && topLvlAction !== 'transfer') {
        //     topLvlAction = this.data.actionDefinition.get(topLvlAction).includedIn;
        // } // while

        this.data.actionCallbacks.set(actionName, callback);
        this.data.actionDefinition.set(actionName, {
            // type: topLvlAction,
            action: actionName,
            includedIn, implies,
            // target, assigner, assignee
        });

    } // PEP#defineAction

} // PEP

module.exports = PEP;