/**
 * Subjects Point
 * @module PolicyAgent.SP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    MongoDB = require('mongodb').MongoClient,
    PolicyPoint = require('./PolicyPoint.js');

//#region SubjectsPoint

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
 * @name SubjectsPoint
 * @extends PolicyPoint
 */
class SubjectsPoint extends PolicyPoint {
    /**
     * @constructs SubjectsPoint
     * @param {JSON} [options={}]
     * @abstract
     * @public
     */
    constructor(options = {}) {
        super(options);

        const connection = {
            host: options['host'] || "localhost:27017",
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
    } // SubjectsPoint.constructor

    /**
     * @name SubjectsPoint#ping
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
    } // SubjectsPoint#ping

    async _retrieve(query) {
        const isArray = Array.isArray(query);

        if (
            typeof query !== 'string' ||
            (isArray && query.some(elem => typeof elem !== 'object' || typeof elem['@type'] !== 'string'))
        )
            this.throw('_request', new TypeError(`invalid argument`));

        let
            client = await this.data.driver.client(),
            result = isArray
                ? query.map(elem => client.db.collection(elem['@type']).find(elem))
                : client.db.collection(query['@type']).find(query);

        // TODO üderdenken

        return isArray
            ? await result.map(resolveQueryResult)
            : await resolveQueryResult(result);
    } // SubjectsPoint#_retrieve

    async _submit() {
        // TODO
    } // SubjectsPoint#_submit

} // SubjectsPoint

//#endregion SubjectsPoint

module.exports = SubjectsPoint;