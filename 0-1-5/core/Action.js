/**
 * Action
 * @module PolicyAgent.Action
 * @author Simon Petrac
 */

const
    Auditor = require('./Auditor.js'),
    _private = new WeakMap();

class Action extends Auditor {
    constructor(actionID) {
        super(actionID);

        Object.assign(this, {
            id: actionID || "",
            includedIn: null,
            implies: []
        });

    } // Action.constructor

    async execute(callback) {
        const _attr = _private.get(this);

        // TODO
    } // Action#execute

} // Action

module.exports = Action;