/**
 * Policy Information Point
 * @module PolicyAgent.PIP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    PolicyPoint = require('./PolicyPoint.js'),
    Context = require('./Context.js'),
    SP = require('./SP.js'),
    RP = require('./RP.js'),
    _source = Symbol();

/**
 * @name PIP
 * @extends PolicyPoint
 */
class PIP extends PolicyPoint {
    /**
     * @constructs PIP
     * @param {JSON} [options={}]
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.subjectsPoints = new Set();
        this.data.resourcePoints = new Set();

    } // PIP.constructor

    connectSP(subjectsPoint) {
        if (!(subjectsPoint instanceof SP))
            this.throw('connectSP', new TypeError(`invalid param`));

        if (this.data.subjectsPoints.add(subjectsPoint))
            this.log('connectSP', `${subjectsPoint.toString(undefined, true)} connected`);
    } // PIP#connectSP

    connectRP(resourcePoint) {
        if (!(resourcePoint instanceof RP))
            this.throw('connectRP', new TypeError(`invalid param`));

        if (this.data.resourcePoints.add(resourcePoint))
            this.log('connectRP', `${resourcePoint.toString(undefined, true)} connected`);
    } // PIP#connectRP

    async _retrieveSubjects(context) {
        if (!(context instanceof Context))
            this.throw('_retrieveSubjects', new TypeError(`invalid argument`));

        let
            query = [],
            promiseArr = [];

        // TODO query aufbauen

        this.data.subjectsPoints.forEach((subjectsPoint) => {
            promiseArr.push(subjectsPoint._retrieve(query));
        });

        // TODO context anreichern

    } // PIP#_retrieveSubjects

    async _submitSubjects(context) {
        if (!(context instanceof Context))
            this.throw('_submitSubjects', new TypeError(`invalid argument`));

        // TODO

    } // PIP#_submitSubjects

    async _retrieveResource(/* TODO */) {

        // TODO

    } // PIP#_retrieveResource

} // PIP

module.exports = PIP;