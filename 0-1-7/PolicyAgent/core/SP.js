/**
 * Subjects Point
 * @module PolicyAgent.SP
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
 * @this {SP}
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
 * @name Subject
 * @class
 */
class Subject {
    /**
     * @constructs Subject
     * @param {JSON} param 
     * @param {SP} source
     */
    constructor(param, source) {
        if (!param || typeof param['uid'] !== 'string' || typeof param['@id'] !== 'string' || typeof param['@type'] !== 'string')
            throw new TypeError(`invalid subject`);
        if (!(source instanceof SP))
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

    _update() {
        return _private.get(this).source._update(this);
    } // Resource#_update

    _delete() {
        return _private.get(this).source._delete(this);
    } // Resource#_delete

} // Subject

/**
 * @name SP
 * @extends PolicyAgent.PolicyPoint
 */
class SP extends PolicyPoint {
    /**
     * @constructs SP
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
            dbName: options['dbName'] || "SubjectsPoint"
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

    } // SP.constructor

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
     * @name SP#_find
     * @param {(object|object[])} subject 
     * @returns {(object|object[])}
     * @package
     * @async
     * 
     * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find MongoDB Driver API - Collection#find}
     */
    async _find(subject) {
        if (Array.isArray(subject))
            return await Promise.all(subject.map(this._find));

        if (!subject || typeof subject['@type'] !== 'string')
            this.throw('_find', new TypeError(`invalid argument`));

        const
            client = await this.data.driver.client(),
            collection = client.db.collection(resource['@type']);

        if (!collection) return;

        return await new Promise((resolve, reject) => {
            collection.find(subject).toArray((err, docs) => {
                if (err) {
                    this.throw('_find', err, true); // silent
                    resolve(undefined);
                } else if (docs.length === 1) {
                    try {
                        let subject = new Subject(docs[0], this);
                        resolve(subject);
                    } catch (err) {
                        this.throw('_find', err, true); // silent
                        resolve(undefined);
                    }
                } else {
                    resolve(undefined);
                }
            })
        });
    } // SP#_find

    /**
     * @name SP#_create
     * @param {(object|object[])} subject 
     * @returns {(boolean|boolean[])}
     * @package
     * @async
     * 
     * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#insertOne MongoDB Driver API - Collection#insertOne}
     */
    async _create(subject) {
        if (Array.isArray(subject))
            return await Promise.all(subject.map(this._create));

        if (!subject || typeof subject['@type'] !== 'string' || typeof subject['@id'] !== 'string' || typeof subject['uid'] !== 'string')
            this.throw('_create', new TypeError(`invalid argument`));

        const
            client = await this.data.driver.client(),
            collection = client.db.collection(resource['@type']);

        if (!collection) return;

        return await new Promise((resolve, reject) => {
            collection.insertOne(subject)
                .then((result) => {
                    resolve(result['result']['ok'] === 1);
                })
                .catch((err) => {
                    this.throw('_create', err, true); // silent
                    resolve(false);
                })
        });
    } // SP#_create

    /**
     * @name SP#_update
     * @param {(object|object[])} subject 
     * @returns {(boolean|boolean[])}
     * @package
     * @async
     * 
     * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#updateOne MongoDB Driver API - Collection#updateOne}
     */
    async _update(subject) {
        if (Array.isArray(subject))
            return await Promise.all(subject.map(this._update));

        if (!subject || typeof subject['@type'] !== 'string' || typeof subject['uid'] !== 'string')
            this.throw('_update', new TypeError(`invalid argument`));

        const
            client = await this.data.driver.client(),
            collection = client.db.collection(resource['@type']);

        if (!collection) return;

        return await new Promise((resolve, reject) => {
            collection.updateOne({ 'uid': subject['uid'] }, subject)
                .then((result) => {
                    resolve(result['result']['ok'] === 1);
                })
                .catch((err) => {
                    this.throw('_update', err, true); // silent
                    resolve(false);
                })
        });
    } // SP#_update

    /**
     * @name SP#_delete
     * @param {(object|object[])} subject 
     * @returns {(boolean|boolean[])}
     * @package
     * @async
     * 
     * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#deleteOne MongoDB Driver API - Collection#deleteOne}
     */
    async _delete(subject) {
        if (Array.isArray(subject))
            return await Promise.all(subject.map(this._delete));

        if (!subject || typeof subject['@type'] !== 'string' || typeof subject['uid'] !== 'string')
            this.throw('_delete', new TypeError(`invalid argument`));

        const
            client = await this.data.driver.client(),
            collection = client.db.collection(resource['@type']);

        if (!collection) return;

        return await new Promise((resolve, reject) => {
            collection.deleteOne({ 'uid': subject['uid'] })
                .then((result) => {
                    resolve(result['result']['ok'] === 1);
                })
                .catch((err) => {
                    this.throw('_delete', err, true); // silent
                    resolve(false);
                })
        });
    } // SP#_delete

    /**
     * @name SP._Subject
     * @type {class} Subject
     */
    static get _Subject() {
        return Subject;
    } // SP._Subject<getter>

} // SP

module.exports = SP;