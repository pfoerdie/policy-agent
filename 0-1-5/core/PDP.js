/**
 * Policy Decision Point
 * @module PolicyAgent.PDP
 * @author Simon Petrac
 */

const
    PolicyPoint = require('./PolicyPoint.js'),
    Context = require('./Context.js'),
    PIP = require('./PIP.js'),
    PAP = require('./PAP.js');

/**
 * @name PDP
 * @extends PolicyPoint
 */
class PDP extends PolicyPoint {
    /**
     * @constructs PDP
     * @param {JSON} [options={}]
     * @abstract
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.administrationPoint = null;
        this.data.informationPoint = null;

    } // PDP.constructor

    /**
     * Adds a PIP to retrieve information.
     * @name PDP#connectPIP
     * @param {PolicyAgent.PIP} informationPoint 
     */
    connectPIP(informationPoint) {
        if (!(informationPoint instanceof PIP))
            this.throw('connectPIP', new TypeError(`invalid argument`));
        if (this.data.informationPoint)
            this.throw('connectPIP', `AttributeStore already connected`);

        this.data.informationPoint = informationPoint;
        this.log('connectPIP', `${informationPoint.toString(undefined, true)} connected`);
    } // PDP#connectPIP

    /**
     * Adds a PAP to retrieve policies.
     * @name PDP#connectPAP
     * @param {PolicyAgent.PAP} administrationPoint 
     */
    connectPAP(administrationPoint) {
        if (!(administrationPoint instanceof PAP))
            this.throw('connectPAP', new TypeError(`invalid argument`));
        if (this.data.administrationPoint)
            this.throw('connectPAP', `PAP already connected`);

        this.data.administrationPoint = administrationPoint;
        this.log('connectPAP', `${administrationPoint.toString(undefined, true)} connected`);
    } // PDP#connectPAP

    /**
     * @name PDP#_requestDecision
     * @param {Context} context
     * @async
     * 
     * INFO 7.17 Authorization decision:
     *   -> The PDP MUST return a response context, with one <Decision> element of value "Permit", "Deny", "Indeterminate" or "NotApplicable".
     */
    async _requestDecision(context) {
        if (!(context instanceof Context))
            this.throw('_requestDecision', new TypeError(`invalid argument`));

        if (!this.data.administrationPoint)
            this.throw('_requestDecision', new Error(`administrationPoint not connected`));
        if (!this.data.informationPoint)
            this.throw('_requestDecision', new Error(`informationPoint not connected`));

        await this.data.informationPoint._retrieveSubjects(context);

        // TODO die policies aller includedIn und implies müssen auch geladen werden

        let recordsArr = await this.data.administrationPoint._retrievePolicies(context.attr.action, context.attr.subjects);

        // TODO 

        /**
         * INFO {@link https://www.w3.org/TR/odrl-model/#conflict Policy Conflict Strategy}
         * The conflict property SHOULD take one of the following Conflict Strategy Preference values (instance of the ConflictTerm class):
         *      perm: the Permissions MUST override the Prohibitions
         *      prohibit: the Prohibitions MUST override the Permissions
         *      invalid: the entire Policy MUST be void if any conflict is detected
         * 
         * If the conflict property is not explicitly set, the default of invalid will be used.
         * 
         * The Conflict Strategy requirements include:
         *      If a Policy has the conflict property of perm then any conflicting Permission Rule MUST override the Prohibition Rule.
         *      If a Policy has the conflict property of prohibit then any conflicting Prohibition Rule MUST override the Permission Rule.
         *      If a Policy has the conflict property of invalid then any conflicting Rules MUST void the entire Policy.
         */
        context.decision = "Indeterminate";

    } // PDP#_requestDecision

} // PDP

Object.defineProperties(PDP, {});

module.exports = PDP;