/**
 * Policy Information Point
 * @module PolicyAgent.PIP
 * @author Simon Petrac
 */

const
    PolicyPoint = require('./PolicyPoint.js'),
    SP = require('./SP.js'),
    RP = require('./RP.js');

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
     * @param {(object|object[])} requestSubjects
     * @async
     * @package
     */
    async _retrieveSubjects(requestSubjects) {
        const multiReq = Array.isArray(requestSubjects);

        if (multiReq ? requestSubjects.some(elem => !elem || typeof elem !== 'object') : !requestSubjects || typeof requestSubjects !== 'object')
            this.throw('_retrieveSubjects', new TypeError(`invalid argument`));

        let
            responseSubjects = multiReq ? requestSubjects.map(val => undefined) : undefined,
            promiseArr = [];

        this.data.subjectsPoints.forEach(subjectsPoint => promiseArr.push(
            (async () => {
                try {
                    let requestResult = await subjectsPoint._retrieve(requestSubjects);

                    if (multiReq) {
                        if (Array.isArray(requestResult) && requestResult.length === requestSubjects.length)
                            requestResult.forEach((result, index) => {
                                if (result && !responseSubjects[index]) {
                                    result['@source'] = this.id;
                                    responseSubjects[index] = result;
                                }
                            });
                    } else {
                        if (requestResult && !responseSubjects) {
                            responseSubjects['@source'] = this.id;
                            responseSubjects = requestResult;
                        }
                    }
                } catch (err) {
                    this.throw('_retrieveSubjects', err, true); // silent
                }
            })(/* NOTE async call instead of promise */)
        ));

        await Promise.all(promiseArr);
        return responseSubjects;

    } // PIP#_retrieveSubjects

    /**
     * @name PIP#_retrieveResource
     * @param {(object|object[])} responseSubjects
     * @async
     * @package
     */
    async _retrieveResource(responseSubjects) {
        const multiReq = Array.isArray(responseSubjects);

        if (multiReq ? responseSubjects.some(elem => typeof elem !== 'object' || typeof elem['uid'] !== 'string') : typeof responseSubjects !== 'object' || typeof responseSubjects['uid'] !== 'string')
            this.throw('_retrieveResource', new TypeError(`invalid argument`));

        let
            responseResource = multiReq ? responseSubjects.map(val => undefined) : undefined,
            promiseArr = [];

        this.data.resourcePoints.forEach(resourcePoint => promiseArr.push(
            (async () => {
                try {
                    let requestResult = await resourcePoint._retrieve(responseSubjects);

                    if (multiReq) {
                        if (Array.isArray(requestResult) && requestResult.length === requestSubjects.length)
                            requestResult.forEach((result, index) => {
                                if (result && !responseResource[index])
                                    responseResource[index] = result;
                            });
                    } else {
                        if (requestResult && !responseResource)
                            responseResource = requestResult;
                    }
                } catch (err) {
                    // do nothing
                    this.throw('_retrieveResource', err, true);
                }
            })(/* NOTE async call instead of promise */)
        ));

        await Promise.all(promiseArr);
        return responseResource;

    } // PIP#_retrieveResource

    /**
     * TODO Subjects & Resource
     * -    submit
     * -    create
     * -    delete
     */

    static async _submitSubjects() {

        // TODO

    } // PIP._submitSubjects

    static async _submitResource(/* TODO */) {

        // TODO

    } // PIP._submitResource

} // PIP

module.exports = PIP;