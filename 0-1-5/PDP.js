/**
 * @module PolicyAgent.PDP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    PolicyPoint = require('./PolicyPoint.js'),
    Context = require('./Context.js'),
    PIP = require('./PIP.js');

//#region GenericPDP

/**
 * @name GenericPDP
 * @extends PolicyPoint
 */
class GenericPDP extends PolicyPoint {
    /**
     * @constructs GenericPDP
     * @param {JSON} [options={}]
     * @abstract
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.policyStore = null;
        this.data.attributeStore = null;

        // TODO
    } // GenericPDP.constructor

    /**
     * Adds a PIP to retrieve information.
     * @name PDP#connectPIP
     * @param {PolicyAgent.PIP} informationPoint 
     */
    connectPIP(informationPoint) {
        if (!(informationPoint instanceof PIP))
            this.throw('connectPIP', new TypeError(`invalid argument`));

        // if (this.data.informationPoints.has(informationPoint))
        //     this.throw('connectPIP', new Error(`decisionPoint already connected`));

        // this.data.informationPoints.add(informationPoint);

        if (informationPoint instanceof PIP['AttributeStore'])
            if (this.attributeStore)
                this.throw('connectPIP', `AttributeStore already connected`);
            else
                this.attributeStore = informationPoint;
        else if (informationPoint instanceof PIP['PolicyStore'])
            if (this.policyStore)
                this.throw('connectPIP', `PolicyStore already connected`);
            else
                this.policyStore = informationPoint;
        else
            this.throw('connectPIP', `informationPoint not supported`);

        this.log('connectPIP', `${informationPoint.toString(undefined, true)} connected`);
    } // PEP#connectPIP

    /**
     * @name GenericPDP#_request
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


        // TODO
    } // GenericPDP#request

} // GenericPDP

//#endregion GenericPDP

Object.defineProperties(GenericPDP, {});

module.exports = GenericPDP;