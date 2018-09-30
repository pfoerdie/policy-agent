/**
 * Subjects Point
 * @module PolicyAgent.SP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    MongoDB = require('mongodb').MongoClient,
    PolicyPoint = require('./PolicyPoint.js'),
    _promify = (callback, ...args) => new Promise((resolve, reject) => callback(...args, (err, result) => err ? reject(err) : resolve(result)));

/**
 * @name resolveQueryResult
 * @param {object} queryResult 
 * @returns {object}
 * @private
 */
function resolveQueryResult(queryResult) {
    return new Promise((resolve, reject) => queryResult.toArray((err, docs) => {
        if (err)
            reject(err);
        else {
            // TODO
            resolve(docs);
        }
    }));
} // resolveQueryResult

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
     * INFO
     * The query shall not be altered. A new object is used for the result.
     * INFO
     * If a query is not successful, it shall not throw an error, but instead return null.
     */
    async _retrieve(query) {
        const queryArr = Array.isArray(query) ? query : null;

        if (
            (!queryArr && typeof query !== 'object') ||
            (queryArr && queryArr.some(query => typeof query !== 'object'))
        )
            this.throw('_request', new TypeError(`invalid argument`));

        let
            client = await this.data.driver.client(),
            result = queryArr
                ? await Promise.all(queryArr.map(query => _promify(client.db.collection(query['@type']).find(query).toArray)))
                : await _promify(client.db.collection(query['@type']).find(query).toArray);

        const resultArr = queryArr ? result : null;

        if (resultArr)
            resultArr.forEach((result) => {
                // TODO paste the code of the else here
            });
        else {
            // TODO delete the _id property on every doc of the result
        }

        // TODO überdenken

        return result;

    } // SP#_retrieve

    async _submit(query) {

        // TODO

    } // SP#_submit

} // SP

module.exports = SP;