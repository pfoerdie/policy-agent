/**
 * Subjects Point
 * @module PolicyAgent.SP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
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

                    resolve(docs);
                }
            })
    });
} // _retrieveSubject

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

        this.data.requestTimeout = 10e3; // TODO einsetzen

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

        let client = await this.data.driver.client();

        return queryArr ?
            await Promise.all(queryArr.map(query => _retrieveSubject.call(this, client.db, query))) :
            await _retrieveSubject.call(this, client.db, query);

    } // SP#_retrieve

    async _submit(query) {

        // TODO

    } // SP#_submit

} // SP

module.exports = SP;