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

        /**
         * INFO
         * It is not possible to validate the session at this point.
         * All other validation will be done by the Context's constructor.
         */

        // TODO fehlende Subjects aus der Session holen und in param speichern (z.B. assignee)
        // oder an einer anderen Stelle, aber diese schien am geeignetesten

        let promiseArr = [];
        this.data.decisionPoints.forEach(decisionPoint => promiseArr.push(
            (async () => {
                try {
                    let context = new Context(session, param);
                    await decisionPoint._requestDecision(context);
                    return [null, context];
                } catch (err) {
                    // NOTE debugging point
                    return [err];
                }
            })(/* INFO call the async function immediately to get a promise */)
        ));

        let resultArr = await Promise.all(promiseArr);
        resultArr = resultArr.filter(([err]) => !err);

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

        // TODO Auswahl des Contexts
        // TODO Aktionen ausführen (Deny-biased PEP vs Permit-biased PEP)
        // TODO Rückgabewert feststellen

    } // PEP#request

} // PEP

module.exports = PEP;