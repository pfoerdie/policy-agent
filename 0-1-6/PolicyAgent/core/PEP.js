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
        this.data.actions = new Map();
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

        // TODO

        const requestContext = {
            '@context': "PolicyAgent~RequestContext",
            '@graph': []
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
    defineAction(actionName, includedIn, implies = [], callback) {
        // TODO
    } // PEP#defineAction

} // PEP

module.exports = PEP;