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
     * @param {object[]} requestSubjects
     * @async
     * @package
     */
    async _retrieveSubjects(requestSubjects) {
        if (!Array.isArray(requestSubjects) || requestSubjects.some(elem => !elem || typeof elem !== 'object'))
            this.throw('_retrieveSubjects', new TypeError(`invalid argument`));

        let
            responseSubjects = requestSubjects.map(val => undefined),
            promiseArr = [];

        this.data.subjectsPoints.forEach(subjectsPoint => promiseArr.push(
            (async () => {
                try {
                    let resultArr = await subjectsPoint._retrieve(requestSubjects);

                    if (Array.isArray(resultArr) && resultArr.length === requestSubjects.length)
                        resultArr.forEach((result, index) => {
                            if (result && !responseSubjects[index])
                                responseSubjects[index] = result;
                        });
                } catch (err) {
                    this.throw('_retrieveSubjects', err, true); // silent
                }
            })(/* NOTE call the async function immediately to get a promise */)
        ));

        await Promise.all(promiseArr);
        return responseSubjects;

    } // PIP#_retrieveSubjects

    /**
     * @name PIP#_retrieveResource
     * @param {PolicyAgent.Context.Response} requestContext
     * @async
     * @package
     */
    async _retrieveTargetResource(responseContext) {
        if (!(responseContext instanceof Context.Response))
            this.throw('_retrieveResource', new TypeError(`invalid argument`));
        if (!responseContext.environment['PIP'])
            this.throw('_retrieveSubjects', new Error(`subjects must be retrieved first`));
        if (responseContext.environment['PIP'] !== this.id)
            this.throw('_retrieveSubjects', new Error(`another PIP already used`));

        const
            /** @type {Array<string>} */
            requestTargets = [];

        responseContext.entries.forEach((entry) => {
            if (!requestTargets.includes(entry.subject.target))
                requestTargets.push(entry.subject.target);
        });

        let
            statusArr = requestTargets.map(val => false),
            promiseArr = [];

        this.data.resourcePoints.forEach(resourcePoint => promiseArr.push(
            (async () => {
                try {
                    let resultArr = await resourcePoint._retrieve(requestTargets.map(target => responseContext.resource[target]));

                    if (Array.isArray(resultArr) && resultArr.length === requestTargets.length)
                        resultArr.forEach((result, index) => {
                            if (result && !statusArr[index]) {
                                responseContext.resource[requestTargets[index]]['@value'] = result;
                                statusArr[index] = true;
                            } // if
                        });
                } catch (err) {
                    // do nothing
                    this.throw('_retrieveSubjects', err, true);
                }
            })(/* NOTE call the async function immediately to get a promise */)
        ));

        await Promise.all(promiseArr);

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