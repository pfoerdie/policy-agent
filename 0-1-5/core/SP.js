/**
 * Subjects Point
 * @module PolicyAgent.SP
 * @author Simon Petrac
 */

const
    MongoDB = require('mongodb').MongoClient,
    PolicyPoint = require('./PolicyPoint.js');

/**
 * @name _retrieveSubject
 * @param {MongoDB~DataBase} dataBase 
 * @param {object} subject 
 * @returns {Promise<object>}
 * @this {SP}
 * @private
 * 
 * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find MongoDB Driver API - Collection#find}
 */
function _retrieveSubject(dataBase, subject) {
    return new Promise((resolve, reject) => {
        dataBase
            .collection(subject['@type'])
            .find(subject)
            .toArray((err, docs) => {
                if (err) {
                    this.throw('_retrieve', err, true); // silent
                    resolve(undefined);
                } else if (docs.length === 1) {
                    if (typeof docs[0]['uid'] === 'string') {
                        delete docs[0]['_id'];
                        resolve(docs[0]);
                    } else {
                        this.throw('_retrieve', `missing uid (${docs[0]['@id']})`, true); // silent
                        resolve(undefined);
                    }
                } else {
                    resolve(undefined);
                }
            })
    });
} // _retrieveSubject

/**
 * @name _submitSubject
 * @param {MongoDB~DataBase} dataBase 
 * @param {object} subject 
 * @returns {Promise}
 * @this {SP}
 * @private
 * 
 * {@link http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#update MongoDB Driver API - Collection#update}
 */
function _submitSubject(dataBase, subject) {
    return new Promise((resolve, reject) => {
        dataBase
            .collection(subject['@type'])
            .update(subject)
            .toArray((err, result) => {
                if (err) {
                    this.throw('_retrieve', err, true); // silent
                    resolve(false);
                } else {
                    console.log(result);
                    resolve(true);
                }
            })
    });
} // _submitSubject

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

        this.data.driver = {
            client: () => new Promise((resolve, reject) => MongoDB.connect(
                `mongodb://${connection.host}`,
                { useNewUrlParser: true },
                (err, client) => {
                    if (err)
                        reject(err);
                    else {
                        client.db = client.db(connection.dbName);
                        resolve(client);
                    }
                }
            ))
        };

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
     * @name SP#_retrieve
     * @param {(JSON|JSON[])} query 
     * @returns {(object|object[])}
     * @async
     * 
     * INFO The query shall not be altered. A new object is used for the result.
     * INFO If a query is not successful, it shall not throw an error, but instead return null.
     */
    async _retrieve(query) {
        const
            queryArr = Array.isArray(query) ? query : null,
            queryInvalid = (query) => (!query || typeof query !== 'object' || typeof query['@type'] !== 'string');

        if (queryArr ? queryArr.some(queryInvalid) : queryInvalid(query))
            this.throw('_request', new TypeError(`invalid argument`));

        let
            client = await this.data.driver.client(),
            resultPromise = queryArr
                ? Promise.all(queryArr.map(query => _retrieveSubject.call(this, client.db, query)))
                : _retrieveSubject.call(this, client.db, query);

        try {
            return await _timeoutPromise(resultPromise, this.data.requestTimeout);
        } catch (err) {
            this.throw('_retrieve', err);
        }
    } // SP#_retrieve

    /**
     * @name SP#_submit
     * @param {(JSON|JSON[])} query 
     * @returns {*} TODO
     * @async
     */
    async _submit(query) {
        const
            queryArr = Array.isArray(query) ? query : null,
            queryInvalid = (query) => (!query || typeof query !== 'object' || typeof query['@type'] !== 'string');

        if (queryArr ? queryArr.some(queryInvalid) : queryInvalid(query))
            this.throw('_submit', new TypeError(`invalid argument`));

        let
            client = await this.data.driver.client(),
            resultPromise = queryArr
                ? Promise.all(queryArr.map(query => _submitSubject.call(this, client.db, query)))
                : _submitSubject.call(this, client.db, query);

        try {
            return await _timeoutPromise(resultPromise, this.data.requestTimeout);
        } catch (err) {
            this.throw('_submit', err);
        }
    } // SP#_submit

} // SP

module.exports = SP;