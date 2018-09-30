/**
 * Policy Decision Point
 * @module PolicyAgent.PDP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
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
        if (this.informationPoint)
            this.throw('connectPIP', `AttributeStore already connected`);

        this.informationPoint = informationPoint;
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
        if (this.administrationPoint)
            this.throw('connectPAP', `PAP already connected`);

        this.administrationPoint = administrationPoint;
        this.log('connectPAP', `${administrationPoint.toString(undefined, true)} connected`);
    } // PDP#connectPAP

    /**
     * @name PDP#_requestDecision
     * @param {Context} context
     * @async
     * 
     * NOTE 7.17 Authorization decision
     * - The PDP MUST return a response context, with one <Decision> element of value "Permit", "Deny", "Indeterminate" or "NotApplicable".
     */
    async _requestDecision(context) {
        if (!(context instanceof Context))
            this.throw('_requestDecision', new TypeError(`invalid argument`));

        const _attr = _private.get(this);

        if (!_attr.administrationPoint)
            this.throw('_requestDecision', new Error(`administrationPoint not connected`));
        if (!_attr.informationPoint)
            this.throw('_requestDecision', new Error(`informationPoint not connected`));

        for (let subjRelation of context.subject['relation']) {
            if (typeof subjRelation['@id'] === 'string')
                context.data.missing.add(subjRelation['@id']);
        }

        for (let subjFunction of context.subject['function']) {
            if (typeof subjFunction['@id'] === 'string')
                context.data.missing.add(subjFunction['@id']);
        }

        await context.next(_attr.informationPoint);
        // NOTE falls der context die source den attributen hinzufügt, kann es auch gerne mehrere informationPoints pro PDP geben
        //      da in der Execution Phase diese auch zurückgeschrieben werden können

        // TODO
    } // PDP#_requestDecision

} // PDP

Object.defineProperties(PDP, {});

module.exports = PDP;