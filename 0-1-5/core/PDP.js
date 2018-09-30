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

//#region PDP

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

        this.data.policyStore = null;
        this.data.attributeStore = null;

    } // PDP.constructor

    /**
     * Adds a PIP to retrieve information.
     * @name PDP#connectPIP
     * @param {PolicyAgent.PIP} informationPoint 
     */
    connectPIP(informationPoint) {
        if (!(informationPoint instanceof PIP))
            this.throw('connectPIP', new TypeError(`invalid argument`));
        if (this.attributeStore)
            this.throw('connectPIP', `AttributeStore already connected`);

        this.attributeStore = informationPoint;
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
        if (this.policyStore)
            this.throw('connectPAP', `PAP already connected`);

        this.policyStore = administrationPoint;
        this.log('connectPAP', `${administrationPoint.toString(undefined, true)} connected`);
    } // PDP#connectPAP

    /**
     * @name PDP#_request
     * @param {Context} context
     * @async
     * 
     * NOTE 7.17 Authorization decision
     * - The PDP MUST return a response context, with one <Decision> element of value "Permit", "Deny", "Indeterminate" or "NotApplicable".
     */
    async _request(context) {
        if (!(context instanceof Context))
            this.throw('_request', new TypeError(`invalid argument`));

        const _attr = _private.get(this);

        if (!_attr.policyStore)
            this.throw('_request', new Error(`policyStore not connected`));
        if (!_attr.attributeStore)
            this.throw('_request', new Error(`attributeStore not connected`));

        for (let subjRelation of context.subject['relation']) {
            if (typeof subjRelation['@id'] === 'string')
                context.data.missing.add(subjRelation['@id']);
        }

        for (let subjFunction of context.subject['function']) {
            if (typeof subjFunction['@id'] === 'string')
                context.data.missing.add(subjFunction['@id']);
        }

        await context.next(_attr.attributeStore);
        // NOTE falls der context die source den attributen hinzufügt, kann es auch gerne mehrere attributeStores pro PDP geben
        //      da in der Execution Phase diese auch zurückgeschrieben werden können

        if (context.data.missing.size > 0)
            this.throw('_request', new Error(`missing attributes`));

        // TODO
    } // PDP#request

} // PDP

//#endregion PDP

Object.defineProperties(PDP, {});

module.exports = PDP;