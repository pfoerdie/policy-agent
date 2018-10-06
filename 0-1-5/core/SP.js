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
 * @returns {Promise}
 * @this {SP}
 * @private
 */
function _retrieveSubject(dataBase, subject) {
    return new Promise((resolve, reject) => {
        dataBase
            .collection(subject['@type'])
            .find(subject)
            .toArray((err, docs) => {
                if (err) {
                    this.throw('_retrieve', err, true); // silent
                    resolve(null);
                } else {
                    docs.forEach((doc) => {
                        delete doc['_id'];

                        Object.defineProperty(doc, '@source', {
                            value: this.id
                        });
                    });

                    resolve(docs.length === 0 ? null : docs.length === 1 ? docs[0] : docs);
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
 */
function _submitSubject(dataBase, subject) {

    // TODO

} // _submitSubject

/**
 * @name SP
 * @extends PolicyPoint
 */
class SP extends PolicyPoint {
    /**
     * @constructs SP
     * @param {JSON} [options={}]
     * @param {string} [options.host="localhost"]
     * @param {number} [options.port=27017]
     * @param {string} [options.options={}]
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
     * @returns {(*|[*])}
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
                : _retrieveSubject.call(this, client.db, query),
            success = false;

        /** INFO timeout mechanic */
        await Promise.race([
            resultPromise,
            new Promise((resolve, reject) => (0 < this.data.requestTimeout && this.data.requestTimeout < Infinity)
                ? resolve()
                : setTimeout(
                    () => success ? resolve() : reject(this.throw('_retrieve', new Error(`timed out`), true)),
                    this.data.requestTimeout
                ))
        ]);

        success = true;
        return await resultPromise;
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
            this.throw('_request', new TypeError(`invalid argument`));

        let
            client = await this.data.driver.client(),
            resultPromise = queryArr
                ? Promise.all(queryArr.map(query => _submitSubject.call(this, client.db, query)))
                : _submitSubject.call(this, client.db, query),
            success = false;

        /** INFO timeout mechanic */
        await Promise.race([
            resultPromise,
            new Promise((resolve, reject) => (0 < this.data.requestTimeout && this.data.requestTimeout < Infinity)
                ? resolve()
                : setTimeout(
                    () => success ? resolve() : reject(this.throw('_submit', new Error(`timed out`), true)),
                    this.data.requestTimeout
                ))
        ]);

        success = true;
        return await resultPromise;
    } // SP#_submit

} // SP

module.exports = SP;