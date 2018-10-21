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
 * @extends PolicyAgent.PolicyPoint
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

    /**
     * @name PIP#_retrieveSubjects
     * @param {object} subjects
     * @returns {object} The modified subjects, though modifications are made on the original object anyway.
     * @async
     * @package
     */
    async _retrieveSubjects(subjects) {
        if (!subjects || typeof subjects !== 'object')
            this.throw('_retrieveSubjects', new TypeError(`invalid argument`));

        let
            subjNames = Object.keys(subjects),
            queryArr = subjNames.map(name => subjects[name]),
            promiseArr = [];

        this.data.subjectsPoints.forEach(subjectsPoint => promiseArr.push(
            (async () => {
                try {
                    let resultArr = await subjectsPoint._retrieve(queryArr);

                    if (Array.isArray(resultArr) && resultArr.length === subjNames.length)
                        resultArr.forEach((result, index) => {
                            let subjName = subjNames[index];

                            if (result && !subjects[subjName]['@source']) {
                                Object.defineProperty(result, '@source', {
                                    enumerable: true,
                                    value: this.id
                                });

                                Object.defineProperty(subjects, subjName, {
                                    enumerable: true,
                                    value: result
                                });
                            }
                        });
                } catch (err) {
                    // do nothing
                    this.throw(_retrieveSubjects, err, true);
                }
            })(/* NOTE call the async function immediately to get a promise */)
        ));

        await Promise.all(promiseArr);
        return subjects;

    } // PIP#_retrieveSubjects

    async _retrieveResource(/* TODO */) {

        // TODO

    } // PIP#_retrieveResource

    /**
     * TODO Subjects & Resource
     * -    submit
     * -    create
     * -    delete
     */

    static async _submitSubjects(context) {
        if (!(context instanceof Context.Response))
            this.throw('_submitSubjects', new TypeError(`invalid argument`));

        // TODO

    } // PIP._submitSubjects

    static async _submitResource(/* TODO */) {

        // TODO

    } // PIP._submitResource

} // PIP

module.exports = PIP;