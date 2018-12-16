/**
 * Policy Information Point
 * @module PolicyAgent.PIP
 * @author Simon Petrac
 */

const
    PolicyPoint = require('./PolicyPoint.js'),
    _private = new WeakMap();

/**
 * @name Information
 * @class
 */
class Information {
    /**
     * @constructs Information
     * @param {JSON} param 
     * @param {RP} source
     */
    constructor(param, source) {
        if (!(source instanceof PIP))
            throw new TypeError(`invalid argument`);
        if (!param || typeof param['uid'] !== 'string' || typeof param['@id'] !== 'string' || typeof param['@type'] !== 'string')
            throw new Error(`invalid information`);

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

    } // Information.constructor

    get _attr() {
        return _private.get(this);
    } // Information#_attr<getter>

    _update() {
        return this._attr.source._update(this);
    } // Information#_update

    _delete() {
        return this._attr.source._delete(this);
    } // Information#_delete

} // Information

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

        const connection = {
            host: (options['host'] || "localhost") + ":" + (options['port'] || 27017),
            dbName: options['dbName'] || "InformationPoint"
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

        this.data.collections = [];

    } // PIP.constructor

    /**
     * @name SP#ping
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
    } // SP#ping

    /**
     * @name PIP#_find
     * @param {(object|object[])} query 
     * @returns {(object|object[])}
     * @package
     * @async
     * 
     * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find MongoDB Driver API - Collection#find}
     */
    async _find(query) {
        if (Array.isArray(query))
            return await Promise.all(query.map(this._find));

        if (!query || typeof query['@type'] !== 'string')
            this.throw('_find', new TypeError(`invalid argument`));

        const
            client = await this.data.driver.client(),
            collection = client.db.collection(resource['@type']);

        if (!collection) return;

        return await new Promise((resolve, reject) => {
            collection.find(query).toArray((err, docs) => {
                if (err) {
                    this.throw('_find', err, true); // silent
                    resolve(undefined);
                } else if (docs.length === 1) {
                    try {
                        let result = new Information(docs[0], this);
                        resolve(result);
                    } catch (err) {
                        this.throw('_find', err, true); // silent
                        resolve(undefined);
                    }
                } else {
                    resolve(undefined);
                }
            })
        });
    } // PIP#_find

    /**
     * @name PIP#_create
     * @param {(object|object[])} query 
     * @returns {(boolean|boolean[])}
     * @package
     * @async
     * 
     * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#insertOne MongoDB Driver API - Collection#insertOne}
     */
    async _create(query) {
        if (Array.isArray(query))
            return await Promise.all(query.map(this._create));

        if (!query || typeof query['@type'] !== 'string' || typeof query['@id'] !== 'string' || typeof query['uid'] !== 'string')
            this.throw('_create', new TypeError(`invalid argument`));

        const
            client = await this.data.driver.client(),
            collection = client.db.collection(resource['@type']);

        if (!collection) return;

        try {
            let result = await collection.insertOne(query);
            if (result['result']['ok'] === 1)
                return new Information(query);
        } catch (err) {
            this.throw('_create', err, true); // silent
        }
    } // PIP#_create

    /**
     * @name PIP#_update
     * @param {(object|object[])} query 
     * @returns {(boolean|boolean[])}
     * @package
     * @async
     * 
     * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#updateOne MongoDB Driver API - Collection#updateOne}
     */
    async _update(query) {
        if (Array.isArray(query))
            return await Promise.all(query.map(this._update));

        if (!query || typeof query['@type'] !== 'string' || typeof query['uid'] !== 'string')
            this.throw('_update', new TypeError(`invalid argument`));

        const
            client = await this.data.driver.client(),
            collection = client.db.collection(resource['@type']);

        if (!collection) return;

        try {
            let result = await collection.updateOne({ 'uid': query['uid'] }, query);
            return result['result']['ok'] === 1;
        } catch (err) {
            this.throw('_update', err, true); // silent
        }
    } // PIP#_update

    /**
     * @name PIP#_delete
     * @param {(object|object[])} query 
     * @returns {(boolean|boolean[])}
     * @package
     * @async
     * 
     * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#deleteOne MongoDB Driver API - Collection#deleteOne}
     */
    async _delete(query) {
        if (Array.isArray(query))
            return await Promise.all(query.map(this._delete));

        if (!query || typeof query['@type'] !== 'string' || typeof query['uid'] !== 'string')
            this.throw('_delete', new TypeError(`invalid argument`));

        const
            client = await this.data.driver.client(),
            collection = client.db.collection(resource['@type']);

        if (!collection) return;

        try {
            let result = await collection.deleteOne({ 'uid': query['uid'] });
            return result['result']['ok'] === 1;
        } catch (err) {
            this.throw('_delete', err, true); // silent
        }
    } // PIP#_delete

} // PIP

module.exports = PIP;