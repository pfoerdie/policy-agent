/**
 * Resource Point
 * @module PolicyAgent.RP
 * @author Simon Petrac
 */

const
    MongoDB = require('mongodb').MongoClient,
    PolicyPoint = require('./PolicyPoint.js'),
    _private = new WeakMap();

/**
 * @name _timeoutPromise
 * @param {Promise} origPromise 
 * @param {number} toTime 
 * @private
 * @async
 */
async function _timeoutPromise(origPromise, duration) {
    if (duration === Infinity || duration < 0)
        return await origPromise;

    let timeout, toPromise = new Promise((resolve, reject) => {
        timeout = setTimeout(() => reject(new Error(`timed out`)), duration);
    });

    await Promise.race([origPromise, toPromise]);
    clearTimeout(timeout);
    return await origPromise;
} // _timeoutPromise

/**
 * @name Resource
 * @class
 */
class Resource {
    /**
     * @constructs Resource
     * @param {JSON} param 
     * @param {RP} source
     */
    constructor(param, source) {
        if (!param || typeof param['uid'] !== 'string' || typeof param['@id'] !== 'string' || typeof param['@type'] !== 'string')
            throw new TypeError(`invalid resource`);
        if (!(source instanceof RP))
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

    /* TODO ***
    async get '@value'() {
        const _attr = _private.get(this);
        if (!_attr.value) {
            let result = await _attr.source._environmentRequest({ find: [this] });
            if (result) _attr.value = result.find[0];
        }
        return _attr.value;
    } // Resource#@value<getter>
    */

    _update() {
        // TODO value
        return _private.get(this).source._update(this);
    } // Resource#_update

    _delete() {
        // TODO value
        return _private.get(this).source._delete(this);
    } // Resource#_delete

} // Resource

/**
 * @name RP
 * @extends PolicyAgent.PolicyPoint
 */
class RP extends PolicyPoint {
    /**
     * @constructs RP
     * @param {JSON} [options={}]
     * @param {string} [options.host="localhost"]
     * @param {number} [options.port=27017]
     * @abstract
     * @public
     */
    constructor(options = {}) {
        super(options);

        const connection = {
            host: (options['host'] || "localhost") + ":" + (options['port'] || 27017),
            dbName: options['dbName'] || "ResourcePoint"
        };

        this.data.requestTimeout = 10e3; // ms
        this.data.clientTimeout = 10e3; // ms

        let tmpClient = undefined, tmpTS = 0;
        this.data.driver = {
            client: () => new Promise((resolve, reject) => {
                let nowTS = Date.now();
                if (tmpClient && (nowTS - tmpTS) < this.data.clientTimeout) {
                    tmpTS = nowTS;
                    return resolve(tmpClient);
                }

                MongoDB.connect(
                    `mongodb://${connection.host}`,
                    { useNewUrlParser: true },
                    (err, client) => {
                        if (err)
                            reject(err);
                        else {
                            client.db = client.db(connection.dbName);
                            tmpTS = nowTS;
                            tmpClient = client;
                            resolve(client);
                        }
                    }
                ); // MongoDB.connect
            }) // client:
        }; // this.data.driver

    } // RP.constructor

    /**
     * @name RP#ping
     * @async
     */
    async ping() {
        try {
            const client = await this.data.driver.client();
            client.close();

            this.log('ping', "success");
            return client['s']['options']['servers'][0];
        } catch (err) {
            this.throw('ping', err);
        }
    } // RP#ping

    /**
     * @name RP#_find
     * @param {(object|object[])} resource 
     * @returns {(object|object[])}
     * @package
     * @async
     * 
     * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find MongoDB Driver API - Collection#find}
     */
    async _find(resource) {
        if (Array.isArray(resource))
            return await Promise.all(resource.map(this._find));

        if (!resource || typeof resource['@type'] !== 'string')
            this.throw('_find', new TypeError(`invalid argument`));

        const
            client = await this.data.driver.client(),
            collection = client.db.collection(resource['@type']);

        if (!collection) return;

        return await new Promise((resolve, reject) => {
            collection.find(resource).toArray((err, docs) => {
                if (err) {
                    this.throw('_find', err, true); // silent
                    resolve(undefined);
                } else if (docs.length === 1) {
                    try {
                        let resource = new Resource(docs[0], this);
                        resolve(resource);
                    } catch (err) {
                        this.throw('_find', err, true); // silent
                        resolve(undefined);
                    }
                } else {
                    resolve(undefined);
                }
            })
        });
    } // RP#_find

    /**
     * @name RP#_create
     * @param {(object|object[])} resource 
     * @returns {(boolean|boolean[])}
     * @package
     * @async
     * 
     * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#insertOne MongoDB Driver API - Collection#insertOne}
     */
    async _create(resource) {
        if (Array.isArray(resource))
            return await Promise.all(resource.map(this._create));

        if (!resource || typeof resource['@type'] !== 'string' || typeof resource['@id'] !== 'string' || typeof resource['uid'] !== 'string')
            this.throw('_create', new TypeError(`invalid argument`));

        const
            client = await this.data.driver.client(),
            collection = client.db.collection(resource['@type']);

        if (!collection) return;

        return await new Promise((resolve, reject) => {
            collection.collection(resource['@type']).insertOne(resource)
                .then((result) => {
                    resolve(result['result']['ok'] === 1);
                })
                .catch((err) => {
                    this.throw('_create', err, true); // silent
                    resolve(false);
                })
        });
    } // RP#_create

    /**
     * @name RP#_update
     * @param {(object|object[])} resource 
     * @returns {(boolean|boolean[])}
     * @package
     * @async
     * 
     * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#updateOne MongoDB Driver API - Collection#updateOne}
     */
    async _update(resource) {
        if (Array.isArray(resource))
            return await Promise.all(resource.map(this._update));

        if (!resource || typeof resource['@type'] !== 'string' || typeof resource['uid'] !== 'string')
            this.throw('_update', new TypeError(`invalid argument`));

        const
            client = await this.data.driver.client(),
            collection = client.db.collection(resource['@type']);

        if (!collection) return;

        return await new Promise((resolve, reject) => {
            collection.updateOne({ 'uid': resource['uid'] }, resource)
                .then((result) => {
                    resolve(result['result']['ok'] === 1);
                })
                .catch((err) => {
                    this.throw('_update', err, true); // silent
                    resolve(false);
                })
        });
    } // RP#_update

    /**
     * @name RP#_delete
     * @param {(object|object[])} resource 
     * @returns {(boolean|boolean[])}
     * @package
     * @async
     * 
     * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#deleteOne MongoDB Driver API - Collection#deleteOne}
     */
    async _delete(resource) {
        if (Array.isArray(resource))
            return await Promise.all(resource.map(this._delete));

        if (!resource || typeof resource['@type'] !== 'string' || typeof resource['uid'] !== 'string')
            this.throw('_delete', new TypeError(`invalid argument`));

        const
            client = await this.data.driver.client(),
            collection = client.db.collection(resource['@type']);

        if (!collection) return;

        return await new Promise((resolve, reject) => {
            collection.deleteOne({ 'uid': resource['uid'] })
                .then((result) => {
                    resolve(result['result']['ok'] === 1);
                })
                .catch((err) => {
                    this.throw('_delete', err, true); // silent
                    resolve(false);
                })
        });
    } // RP#_delete

    /**
     * @name SP._Resource
     * @type {class} Resource
     */
    static get _Resource() {
        return Resource;
    } // SP._Resource<getter>

} // RP

module.exports = RP;