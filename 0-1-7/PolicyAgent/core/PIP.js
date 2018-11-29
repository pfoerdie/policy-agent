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
 * @name Subject
 * @class
 */
class Subject {
    /**
     * @constructs Subject
     * @param {JSON} param 
     * @param {PIP} source 
     */
    constructor(param, source) {
        if (!(param && typeof param === 'object' && source instanceof PIP))
            throw new TypeError(`invalid argument`);

        Object.entries(param).forEach(([key, value]) => Object.defineProperty(this, key, {
            writable: key !== 'uid' && !key.startsWith('@'),
            value: value
        }));

        if (typeof this['uid'] !== 'string' || typeof this['@id'] !== 'string' || typeof this['@type'] !== 'string')
            throw new Error(`necessary attributes missing`);

        let
            resource = undefined;

        Object.defineProperties(this, {

            getResource: {
                value: async () => {
                    if (resource === undefined)
                        resource = await source._retrieveResource(this) || undefined;
                    return resource;
                }
            } // Subject#getResource
            ,
            submitResource: {
                value: async (value) => {
                    if (resource ? typeof value === typeof resource : value) {
                        await source._submitResource(this, value);
                        resource = value;
                    }
                }
            } // Subject#submitResource
            ,
            updateSubject: {
                value: async () => {
                    // TODO
                }
            } // Subject#updateSubject
        });

    } // Subject.constructor

} // Subject

/**
 * @name PIP
 * @extends PolicyAgent.PolicyPoint
 * @class
 */
class PIP extends PolicyPoint {
    /**
     * @constructs PIP
     * @param {JSON} [options={}]
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.SPs = new Set();
        this.data.RPs = new Set();
        this.data.EPs = new Set();

    } // PIP.constructor

    connect(sreP) {
        if (sreP instanceof SP)
            this.data.SPs.add(sreP);
        else if (sreP instanceof RP)
            this.data.RPs.add(sreP);
        else
            this.throw('connect', new TypeError(`invalid argument`));

        this.log('connect', `${sreP.toString(undefined, true)} connected`);
        return this;
    } // PIP#connect

    /**
     * @name PIP#_subjectRequest
     * @param {object} query 
     * @param {Array<object>} [query.find]
     * @param {Array<object>} [query.create]
     * @param {Array<object>} [query.update]
     * @param {Array<object>} [query.delete]
     * @return {{find: object[], create: boolean[], update: boolean[], delete: boolean[]}}
     * @async
     */
    async _subjectRequest(query = {}) {
        let result = await Promise.all([
            Array.isArray(query.find) ?
                Promise.all(findArr.map(elem => Promise.race(
                    this.data.SPs.map(subjectsPoint => subjectsPoint._find(elem))
                ))) : [],
            Array.isArray(query.create) ?
                Promise.all(createArr.map(elem => Promise.race(
                    this.data.SPs.map(subjectsPoint => subjectsPoint._create(elem))
                ))) : [],
            Array.isArray(query.update) ?
                Promise.all(updateArr.map(elem => Promise.race(
                    this.data.SPs.map(subjectsPoint => subjectsPoint._update(elem))
                ))) : [],
            Array.isArray(query.delete) ?
                Promise.all(deleteArr.map(elem => Promise.race(
                    this.data.SPs.map(subjectsPoint => subjectsPoint._delete(elem))
                ))) : []
        ]); // result

        return { find: result[0], create: result[1], update: result[2], delete: result[3] };
    } // PIP#_subjectRequest

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

        this.data.SPs.forEach(subjectsPoint => promiseArr.push(
            (async () => {
                try {
                    let requestResult = await subjectsPoint._find(requestSubjects);

                    if (multiReq) {
                        if (Array.isArray(requestResult) && requestResult.length === requestSubjects.length)
                            requestResult.forEach((result, index) => {
                                if (result && !responseSubjects[index]) {
                                    responseSubjects[index] = new Subject(result, this);
                                }
                            });
                    } else {
                        if (requestResult && !responseSubjects) {
                            responseSubjects = new Subject(requestResult, this);
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

        if (multiReq ? responseSubjects.some(!(elem instanceof Subject)) : !(responseSubjects instanceof Subject))
            this.throw('_retrieveResource', new TypeError(`invalid argument`));

        let
            responseResource = multiReq ? responseSubjects.map(val => undefined) : undefined,
            promiseArr = [];

        this.data.RPs.forEach(resourcePoint => promiseArr.push(
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

    async _submitSubjects(responseSubjects) {
        const multiReq = Array.isArray(responseSubjects);

        if (multiReq ? responseSubjects.some(elem => !elem || typeof elem !== 'object') : !responseSubjects || typeof responseSubjects !== 'object')
            this.throw('_submitSubjects', new TypeError(`invalid argument`));

        if (multiReq) {
            responseSubjects = responseSubjects.map((elem) => {
                let submitSubject = Object.assign({}, elem);
                delete submitSubject['@value'];
                delete submitSubject['@source'];
                return submitSubject;
            });
        } else {
            responseSubjects = Object.assign({}, responseSubjects);
            delete responseSubjects['@value'];
            delete responseSubjects['@source'];
        }

        let promiseArr = [];
        this.data.SPs.forEach(subjectsPoint => promiseArr.push(
            (async () => {
                try {
                    await subjectsPoint._submit(responseSubjects);
                } catch (err) {
                    this.throw('_submitSubjects', err, true); // silent
                }
            })(/* NOTE async call instead of promise */)
        ));
        await Promise.all(promiseArr);

    } // PIP._submitSubjects

    async _submitResource(responseSubjects) {
        const multiReq = Array.isArray(responseSubjects);

        if (multiReq ? responseSubjects.some(!(elem instanceof Subject)) : !(responseSubjects instanceof Subject))
            this.throw('_retrieveResource', new TypeError(`invalid argument`));

        let promiseArr = [];
        this.data.RPs.forEach(resourcePoint => promiseArr.push(
            (async () => {
                try {
                    await resourcePoint._submit(responseSubjects);
                } catch (err) {
                    this.throw('_submitResource', err, true); // silent
                }
            })(/* NOTE async call instead of promise */)
        ));
        await Promise.all(promiseArr);

    } // PIP._submitResource

} // PIP

module.exports = PIP;