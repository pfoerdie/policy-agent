/**
 * Policy Information Point
 * @module PolicyAgent.PIP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    PolicyPoint = require('./PolicyPoint.js'),
    SubjectsPoint = require('./SubjectsPoint.js'),
    ResourcePoint = require('./ResourcePoint.js');

//#region GenericPIP

/**
 * @name GenericPIP
 * @extends PolicyPoint
 */
class GenericPIP extends PolicyPoint {
    /**
     * @constructs GenericPIP
     * @param {JSON} [options={}]
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.SubjectsPoints = new Map();
        this.data.ResourcePoints = new Map();

    } // GenericPIP.constructor

    connectSP(subjectsPoint) {
        if (!(subjectsPoint instanceof SubjectsPoint))
            this.throw('connectSubjectsPoint', new TypeError(`invalid param`));

        this.data.SubjectsPoints.set(Symbol(), subjectsPoint);

        this.log('connectSubjectsPoint', `${subjectsPoint.toString(undefined, true)} connected`);
    } // GenericPIP#connectSubjectsPoint

    connectRP(resourcePoint) {
        if (!(resourcePoint instanceof ResourcePoint))
            this.throw('connectResourcePoint', new TypeError(`invalid param`));

        this.data.ResourcePoints.set(Symbol(), resourcePoint);

        this.log('connectResourcePoint', `${resourcePoint.toString(undefined, true)} connected`);
    } // GenericPIP#connectResourcePoint

} // GenericPIP

//#endregion GenericPIP

module.exports = GenericPIP;