/**
 * Policy Information Point
 * @module PolicyAgent.PIP
 * @author Simon Petrac
 */

const
    PolicyPoint = require('./PolicyPoint.js'),
    SP = require('./SP.js'),
    RP = require('./RP.js'),
    EP = require('./EP.js'),
    _private = new WeakMap();

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
        if (!param || typeof param['uid'] !== 'string' || typeof param['@id'] !== 'string' || typeof param['@type'] !== 'string')
            throw new TypeError(`invalid argument`);
        if (!(source instanceof PIP))
            throw new TypeError(`invalid argument`);

        Object.entries(param).forEach(([key, value]) => {
            if (key.startsWith('_')) return;
            const editable = !(key === 'uid' || key === '@id' || key === '@type');
            Object.defineProperty(this, key, {
                writable: editable,
                enumerable: editable,
                value: value
            });
        });

        _private.set(this, { source });

    } // Subject.constructor

    async _update() {
        let result = await _private.get(this).source._subjectRequest({ update: [this] });
        if (result) return result.update[0];
    } // Resource#_update

    async _delete() {
        let result = await _private.get(this).source._subjectRequest({ delete: [this] });
        if (result) return result.delete[0];
    } // Resource#_delete

} // Subject

/**
 * @name Resource
 * @class
 */
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

        Object.entries(param).forEach(([key, value]) => {
            if (key.startsWith('_')) return;
            const editable = !(key === 'uid' || key === '@id' || key === '@type');
            Object.defineProperty(this, key, {
                writable: editable,
                enumerable: editable,
                value: value
            });
        });

        _private.set(this, { source, value: undefined });

    } // Resource.constructor

    async get '@value'() {
        const _attr = _private.get(this);
        if (!_attr.value) {
            let result = await _attr.source._environmentRequest({ find: [this] });
            if (result) _attr.value = result.find[0];
        }
        return _attr.value;
    } // Resource#@value<getter>

    async _update() {
        const _attr = _private.get(this);
        let result = await (_attr.source._resourceRequest({ update: [this] }));
        // _attr.source._environmentRequest({ update: [this] }); // TODO irgendwie mit einbauen
        if (result) return result.update[0];
    } // Resource#_update

    async _delete() {
        let result = await _private.get(this).source._resourceRequest({ delete: [this] });
        if (result) return result.delete[0];
    } // Resource#_delete

} // Resource

/**
 * @name _handleQuery
 * @param {(Array|*)} queryArr 
 * @param {function[]} queryFnArr 
 * @param {function} transformFn 
 * @returns {Array}
 * @async
 * @private
 */
async function _handleQuery(queryArr, queryFnArr, transformFn = (elem => elem)) {
    if (!queryArr) return;
    if (!Array.isArray(queryArr)) queryArr = [queryArr];

    let resultArr = [];
    await Promise.all(queryArr.map((elem, index) => Promise.all(
        elem ? queryFnArr.map(async (queryFn) => {
            let result = await queryFn(elem);
            if (resultArr[index] === undefined)
                resultArr[index] = transformFn(result);
        }) : undefined
    )));

    return resultArr;
} // _handleQuery

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

        this.data.SPs = new Set(Array.isArray(options['subject'])
            ? options['subject']
                .map(elem => typeof elem === 'string' ? PolicyPoint.get(elem) : elem)
                .filter(elem => elem instanceof SP)
            : undefined
        );

        this.data.RPs = new Set(Array.isArray(options['resource'])
            ? options['resource']
                .map(elem => typeof elem === 'string' ? PolicyPoint.get(elem) : elem)
                .filter(elem => elem instanceof RP)
            : undefined
        );

        this.data.EPs = new Set(Array.isArray(options['environment'])
            ? options['environment']
                .map(elem => typeof elem === 'string' ? PolicyPoint.get(elem) : elem)
                .filter(elem => elem instanceof EP)
            : undefined
        );

    } // PIP.constructor

    /**
     * TODO wichtig!
     * der RP und der SP sollen undefined zurückgeben, wenn die collection nicht existiert
     * => Promise.race funktioniert nicht. Es muss das erste Object genommen werden, das nicht undefined ist, oder so ähnlich!
     * (aktuelle Lösung mit timeoutPromise ist wahrscheinlich nicht die beste)
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
    async _subjectRequest(query) {
        if (this.data.SPs.size === 0)
            this.throw('_subjectRequest', new Error(`no SP connected`));
        if (!query || typeof query !== 'object')
            this.throw('_subjectRequest', new TypeError(`invalid argument`));

        let result = await Promise.all([
            _handleQuery(query.find, this.data.SPs.map(sP => sP._find), result => result ? new Subject(result) : undefined),
            _handleQuery(query.create, this.data.SPs.map(sP => sP._create)),
            _handleQuery(query.update, this.data.SPs.map(sP => sP._update)),
            _handleQuery(query.delete, this.data.SPs.map(sP => sP._delete))
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
    async _resourceRequest(query) {
        if (this.data.RPs.size === 0)
            this.throw('_resourceRequest', new Error(`no RP connected`));
        if (!query || typeof query !== 'object')
            this.throw('_resourceRequest', new TypeError(`invalid argument`));

        let result = await Promise.all([
            _handleQuery(query.find, this.data.RPs.map(rP => rP._find), result => result ? new Resource(result) : undefined),
            _handleQuery(query.create, this.data.RPs.map(rP => rP._create)),
            _handleQuery(query.update, this.data.RPs.map(rP => rP._update)),
            _handleQuery(query.delete, this.data.RPs.map(rP => rP._delete))
        ]); // result

        return { find: result[0], create: result[1], update: result[2], delete: result[3] };
    } // PIP#_resourceRequest

    /**
     * @name PIP#_environmentRequest
     * @param {[object]} query 
     * TODO jsDoc
     */
    async _environmentRequest(query) {
        if (this.data.EPs.size === 0)
            this.throw('_environmentRequest', new Error(`no EP connected`));
        if (!query || typeof query !== 'object')
            this.throw('_environmentRequest', new TypeError(`invalid argument`));

        let result = await Promise.all([
            _handleQuery(query.find, this.data.EPs.map(eP => eP._find))
        ]); // result

        return { find: result[0] };
    } // PIP#_environmentRequest

} // PIP

module.exports = PIP;