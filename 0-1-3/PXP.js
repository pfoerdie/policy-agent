/**
 * @module PolicyAgent~PXP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    PolicyPoint = require(Path.join(__dirname, "PolicyPoint.js"));

/**
 * Policy Execution Point
 * @name PXP
 */
class PXP extends PolicyPoint {
    /**
     * @constructs PXP
     * @param {Neo4jStore} policyStore 
     * @param {MongoStore} attributeStore 
     */
    constructor(policyStore, attributeStore) {
        super('PXP');

        Object.defineProperties(this.param, {
            policyStore: {
                value: Utility.validParam(param => param instanceof DataStore.Neo4j, policyStore)
            },
            attributeStore: {
                value: Utility.validParam(param => param instanceof DataStore.MongoDB, attributeStore)
            }
        });

        Object.defineProperties(this.data, {
            actionCallbacks: {
                value: new Map()
            }
        });
    } // PXP#constructor

    /**
     * @name PXP#ready
     * @inheritdoc
     */
    get ready() {
        return super.ready;
    } // PXP#ready<getter>

    _executeRequest(context) {
        // IDEA PXP#_executeRequest -> FRAGE: wann wird der PXP eigentlich durchlaufen? und wo wird er angehängt? am PDP vllt und nach permission aufgerufen ...
    } // PXP#_executeRequest

    /**
     * @typedef {function} ActionCallback
     * // TODO jsDoc ActionCallback -> @typedef
     * param -> target
     * param -> implied actions
     * returns -> result (format?)
     */

    /**
     * Defines an action for beeing executed, if a request is successful.
     * @name PXP#defineAction
     * @param {string} actionName Name of the action.
     * @param {ActionCallback} actionCallback Callback for the action.
     */
    defineAction(actionName, actionCallback) {
        Utility.validParam('string', actionName);
        Utility.validParam('function', actionCallback);

        if (this.data.actionCallbacks.has(actionName))
            throw new Error(this.toString('defineAction', null, `action '${actionName}' has already been defined`));

        this.data.actionCallbacks.set(actionName, actionCallback);
    } // PXP#defineAction

} // PXP

Utility.getPublicClass(PXP);
module.exports = PXP;