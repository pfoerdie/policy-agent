/**
 * Policy Information Point
 * @module PolicyAgent.PIP
 * @author Simon Petrac
 */

const
    PolicyPoint = require('./PolicyPoint.js'),
    SP = require('./SP.js'),
    RP = require('./RP.js'),
    _private = new WeakMap();

class Subject {
    /**
     * @constructs Subject
     * @param {JSON} param 
     * @param {PIP} source 
     */
    constructor(param, source) {
        if (!param || typeof param['uid'] !== 'string' || typeof param['@id'] !== 'string' || typeof param['@type'] !== 'string')
            throw new TypeError(`invalid argument`);
        if (!(source instanceof PIP))
            throw new TypeError(`invalid argument`);

        Object.entries(param).forEach(([key, value]) => Object.defineProperty(this, key, {
            writable: key !== 'uid' && !key.startsWith('@'),
            value: value
        }));

        _private.set(this, { source });
    } // Subject.constructor

    _update() {
        // TODO
    } // Subject#update

    _delete() {
        // TODO
    } // Subject#delete

} // Subject

class Resource {
    /**
     * @constructs Resource
     * @param {JSON} param 
     * @param {PIP} source 
     */
    constructor(param, source) {
        if (!param || typeof param['uid'] !== 'string' || typeof param['@id'] !== 'string' || typeof param['@type'] !== 'string')
            throw new TypeError(`invalid argument`);
        if (!(source instanceof PIP))
            throw new TypeError(`invalid argument`);

        Object.entries(param).forEach(([key, value]) => Object.defineProperty(this, key, {
            writable: key !== 'uid' && !key.startsWith('@'),
            value: value
        }));

        _private.set(this, { source, value: undefined });
    } // Resource.constructor

    _get() {
        const _attr = _private.get(this);

        if (!_attr.value)
            _attr.value = await _attr.source._environmentRequest(this);

        return _attr.value;
    }// Resource#getResource

    _update() {
        // TODO
    } // Resource#update

    _delete() {
        // TODO
    } // Resource#delete

} // Resource

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
     * TODO wichtig!
     * der RP und der SP sollen undefined zurückgeben, wenn die collection nicht existiert
     * => Promise.race funktioniert nicht. Es muss das erste Object genommen werden, das nicht undefined ist, oder so ähnlich!
     */

    /**
     * @name PIP#_subjectRequest
     * @param {object} query 
     * @param {object[]} [query.find]
     * @param {object[]} [query.create]
     * @param {object[]} [query.update]
     * @param {object[]} [query.delete]
     * @return {{find: object[], create: boolean[], update: boolean[], delete: boolean[]}}
     * @async
     */
    async _subjectRequest(query = {}) {
        if (!query || typeof query !== 'object')
            this.throw('_subjectRequest', new TypeError(`invalid argument`));
        if (this.data.SPs.size === 0)
            this.throw('_subjectRequest', new Error(`no SP connected`));

        let result = await Promise.all([
            Array.isArray(query.find) ?
                Promise.all(query.find.map(elem => Promise.race(
                    this.data.SPs.map(subjectsPoint => {
                        let subject = subjectsPoint._find(elem);
                        if (subject) return new Subject(subject, this);
                    })
                ))) : undefined,
            Array.isArray(query.create) ?
                Promise.all(query.create.map(elem => Promise.race(
                    this.data.SPs.map(subjectsPoint => subjectsPoint._create(elem))
                ))) : undefined,
            Array.isArray(query.update) ?
                Promise.all(query.update.map(elem => Promise.race(
                    this.data.SPs.map(subjectsPoint => subjectsPoint._update(elem))
                ))) : undefined,
            Array.isArray(query.delete) ?
                Promise.all(query.delete.map(elem => Promise.race(
                    this.data.SPs.map(subjectsPoint => subjectsPoint._delete(elem))
                ))) : undefined
        ]); // result

        return { find: result[0], create: result[1], update: result[2], delete: result[3] };
    } // PIP#_subjectRequest

    /**
     * @name PIP#_resourceRequest
     * @param {object} query 
     * @param {object[]} [query.find]
     * @param {object[]} [query.create]
     * @param {object[]} [query.update]
     * @param {object[]} [query.delete]
     * @return {{find: object[], create: boolean[], update: boolean[], delete: boolean[]}}
     * @async
     */
    async _resourceRequest(query = {}) {
        if (!query || typeof query !== 'object')
            this.throw('_resourceRequest', new TypeError(`invalid argument`));
        if (this.data.RPs.size === 0)
            this.throw('_resourceRequest', new Error(`no RP connected`));

        let result = await Promise.all([
            Array.isArray(query.find) ?
                Promise.all(query.find.map(elem => Promise.race(
                    this.data.RPs.map(resourcePoint => {
                        let resource = resourcePoint._find(elem);
                        if (resource) return new Resource(resource, this);
                    })
                ))) : undefined,
            Array.isArray(query.create) ?
                Promise.all(query.create.map(elem => Promise.race(
                    this.data.RPs.map(resourcePoint => resourcePoint._create(elem))
                ))) : undefined,
            Array.isArray(query.update) ?
                Promise.all(query.update.map(elem => Promise.race(
                    this.data.RPs.map(resourcePoint => resourcePoint._update(elem))
                ))) : undefined,
            Array.isArray(query.delete) ?
                Promise.all(query.delete.map(elem => Promise.race(
                    this.data.RPs.map(resourcePoint => resourcePoint._delete(elem))
                ))) : undefined
        ]); // result

        return { find: result[0], create: result[1], update: result[2], delete: result[3] };
    } // PIP#_resourceRequest

    async _environmentRequest(query = {}) {
        if (!query || typeof query !== 'object')
            this.throw('_environmentRequest', new TypeError(`invalid argument`));
        if (this.data.EPs.size === 0)
            this.throw('_environmentRequest', new Error(`no EP connected`));

    } // PIP#_environmentRequest

} // PIP

module.exports = PIP;