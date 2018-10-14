/**
 * Action
 * @module PolicyAgent.Action
 * @author Simon Petrac
 */

const
    Auditor = require('./Auditor.js');

class Action extends Auditor {
    constructor(actionID) {
        super(actionID);

        Object.assign(this, {
            id: actionID || "",
            includedIn: null,
            implies: [],
            usage: "Indeterminate" // Indeterminate | Permission | Prohibition | Obligation
        });

    } // Action.constructor

} // Action

module.exports = Action;