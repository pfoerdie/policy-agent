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
            subjNames = Array.from(context.attr.subjects.keys()),
            query = subjNames.map(name => context.attr.subjects.get(name)),
            promiseArr = [];

        this.data.subjectsPoints.forEach(subjectsPoint => promiseArr.push(
            (async () => {
                try {
                    let result = await subjectsPoint._retrieve(query);
                    return [null, result];
                } catch (err) {
                    return [err];
                }
            })(/* INFO call the async function immediately to get a promise */)
        ));

        let resultArr = await Promise.all(promiseArr);
        resultArr = resultArr.filter(([err]) => !err);

        let result = resultArr.reduce((acc, [undefined, result]) => {
            // TODO resultArr zu einem result kombinieren
        }, {});

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

    async _submitResource(/* TODO */) {

        // TODO

    } // PIP#_submitResource

} // PIP

module.exports = PIP;