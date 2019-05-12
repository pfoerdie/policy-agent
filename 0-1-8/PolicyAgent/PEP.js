/**
 * Policy Execution Point
 * @module PolicyAgent.PEP
 * @author Simon Petrac
 */

const
    PolicyPoint = require('./PolicyPoint.js'),
    _namespace = require('./namespace.js'),
    _enumerate = (obj, key, value) => Object.defineProperty(obj, key, { enumerable: true, value: value });

/**
 * @name _executeActionRequest
 * @param {Session} session
 * @param {ResponseContext} responseContext
 * @param {string} requestID
 * @param {...*} args
 * @returns {*} result
 * @this {PEP}
 * @async
 * @private
 */
async function _executeActionRequest(session, responseContext, requestID, ...args) {

    let
        response = responseContext['response'][requestID],
        actionCB = this.data.actionCallbacks.get(response['action']),
        actionContext = {};

    /**
     * INFO 7.17 Authorization decision:
     *   -> The PDP MUST return a response context, with one <Decision> element of value "Permit", "Deny", "Indeterminate" or "NotApplicable".
     * NOTE "Condition" muss zusätzlich aufgenommen werden, um Obligations einzuschließen
     */
    if (response['decision'] === 'Deny')
        throw new Error("Permission denied!");
    if (response['decision'] !== 'Permit')
        throw new Error("Permission not granted!");

    _enumerate(actionContext, 'action', response['action']);
    _enumerate(actionContext, 'target', response['includedIn']
        ? (...includedInArgs) => _executeActionRequest.call(this, session, responseContext, response['includedIn'], ...includedInArgs)
        : responseContext['resource'][response['target']]);

    _enumerate(actionContext, 'assigner', response['assigner'] ? responseContext['subject'][response['assigner']]['@id'] : undefined);
    _enumerate(actionContext, 'assignee', response['assignee'] ? responseContext['subject'][response['assignee']]['@id'] : undefined);

    _enumerate(actionContext, 'implies', {});
    for (let implName of response['implies']) {
        _enumerate(actionContext['implies'], implName, (...impliesArgs) => _executeActionRequest.call(this, session, responseContext, response['implies'], ...impliesArgs));
    }

    _enumerate(actionContext, 'request', (param, ...requestArgs) => this.request(param, session, ...requestArgs));

    return await actionCB.call(actionContext, session, ...args);

} // _executeActionRequest

async function _actionUse(session, ...args) {
    let
        target = this['target'],
        result = {};

    for (let key in target) {
        if (key.startsWith('@'))
            _enumerate(result, key, target[key]);
        else if (key !== 'uid')
            result[key] = target[key];
    } // for

    return result;
} // _actionUse

async function _actionTransfer(session, ...args) {
    let
        target = this['target'],
        result = {};

    if (target._update) _enumerate(result, 'update', (elem) => {
        if (elem['@type'] !== target['@type'] || elem['@id'] !== target['@id'])
            throw new Error(`invalid target`);

        Object.assign(target, elem);
        target._update();
    });

    if (target._delete) _enumerate(result, 'delete', (elem) => {
        if (elem['@type'] !== target['@type'] || elem['@id'] !== target['@id'])
            throw new Error(`invalid target`);

        target._delete();
    });

    console.log(target);

    // IDEA Um alle transfer-Methoden abzubilden, müssen diese dafür
    //      vom PDP an den RequestContext gekoppelt werden, da es Unterschiede gibt,
    //      je nachdem welchen Typ das Target hat (Asset|Party|-Collection)
    //      => die übergebene target-resource muss die Methoden enthalten! (aber nicht aufzählbar)

    return result;
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

        this.data.actionDefinition = new Map();
        this.data.actionCallbacks = new Map();

        this.defineAction('use', _actionUse);
        this.defineAction('transfer', _actionTransfer);
    } // PEP.constructor

    /**
     * @name PEP#request
     * @param {JSON} param
     * @param {Object} [session=null]
     * @param {...*} [args]
     * @returns {*}
     * @async
     */
    async request(param, session = null, ...args) {
        if (!param || typeof param !== 'object')
            this.throw('request', new TypeError(`invalid argument`));
        if (!param['target'] || typeof param['target']['@type'] !== 'string')
            this.throw('request', new Error(`invalid target`));
        if (param['action'] && typeof param['action']['@id'] === 'string')
            param['action'] = param['action']['@id'];
        else if (typeof param['action'] !== 'string')
            this.throw('request', new Error(`invalid action`));

        if (session && typeof session !== 'object')
            this.throw('request', new TypeError(`invalid argument`));

        if (!this.data.actionDefinition.has(param['action']))
            this.throw('request', new Error(`action unknown`));

        /* 1. - create RequestContext */

        let requestContext = new _namespace.RequestContext(this, param, session);

        /* 2. - send RequestContext to PDP#_decisionRequest */

        let responseContext = await this.data.PDP._decisionRequest(requestContext);

        // console.log(JSON.stringify(requestContext, null, 2));
        // console.log(JSON.stringify(responseContext, null, 2));

        if (responseContext['decision'] === 'Deny')
            throw new Error("Permission denied");
        if (responseContext['decision'] === 'NotApplicable')
            throw new Error("Decision not possible");

        /* 3. - execute Actions */

        let result = await _executeActionRequest.call(this, session, responseContext, requestContext['entryPoint'], ...args);
        return result;

    } // PEP#request

    /**
     * @name PEP#defineAction
     * @param {string} actionName 
     * @param {function} callback 
     * @param {string} includedIn 
     * @param {string[]} [implies=[]] 
     */
    defineAction(actionName, callback, includedIn, implies = []) {

        /**
         * NOTE
         * Es kann durchaus vorkommen, dass eine implied-Action ein anderes Target hat.
         * Das kann momentan durch einen weiteren Request abgehandelt werden,
         * aber es wäre praktisch, wenn für ein implies auch ein festes Target
         * definiert werden kann. Dazu müsste die Definierung der Aktion etwas
         * abgeändert werden.
         */

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
        if (!Array.isArray(implies) || !implies.every(elem => typeof elem === 'string'))
            this.throw('defineAction', new TypeError(`invalid argument`));
        if (includedIn && !this.data.actionDefinition.has(includedIn))
            this.throw('defineAction', new Error(`includedIn unknown`));
        if (!implies.every(elem => this.data.actionDefinition.has(elem)))
            this.throw('defineAction', new Error(`implies unknown`));

        this.data.actionCallbacks.set(actionName, callback);
        this.data.actionDefinition.set(actionName, {
            action: actionName,
            includedIn, implies
        });

    } // PEP#defineAction

} // PEP

module.exports = PEP;