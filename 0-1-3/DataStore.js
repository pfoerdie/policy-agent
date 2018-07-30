/**
 * @module PolicyAgent~DataStore
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js"));

class DataStore {
    constructor() {
        if (new.target === DataStore)
            throw new Error(`DataStore#constructor -> the DataStore is an abstract class`);

        Object.defineProperties(this, {
            param: {
                value: {}
            },
            data: {
                value: Object.create({}, {
                    valid: {
                        writable: true,
                        value: false
                    }
                })
            }
        });
    } // DataStore#constructor

    async ping() {
        throw new Error(`DataStore#ping() -> this function must be implemented by inheriting class`);
    } // DataStore#constructor
} // DataStore

exports.Neo4j = ((/* closure */) => {

    let Neo4j;

    class Neo4jStore extends DataStore {

        /**
         * @param {string} [host="localhost"] Hostname of the Neo4j instance.
         * @param {string} [user="neo4j"] Username to access the Neo4j instance.
         * @param {string} [password="neo4j"] Password of the User.
         * @constructor
         */
        constructor(host = "localhost:7687", user = "neo4j", password = "neo4j") {
            if (!Neo4j) Neo4j = require('neo4j-driver').v1;
            super();

            Object.defineProperties(this.param, {
                host: {
                    value: Utility.validParam('string', host)
                },
                user: {
                    value: Utility.validParam('string', user)
                },
                password: {
                    value: Utility.validParam('string', password)
                }
            });

            Object.defineProperties(this.data, {
                driver: {
                    value: Neo4j.driver(`bolt://${this.param.host}`, Neo4j.auth.basic(this.param.user, this.param.password))
                }
            });

            this.ping().catch(console.error);
        } // Neo4jStore#constructor

        /**
         * Sends a basic request to Neo4j to test the connection and login credentials.
         * @returns {Neo4j~ServerInfo} Server info returned by Neo4j.
         */
        async ping() {
            const
                session = this.data.driver.session(),
                result = await session.run(`RETURN NULL`);

            this.data.valid = true;
            return result['summary']['server'];
        } // Neo4jStore#ping

        /**
         * Sends one or multiple queries to the Neo4j instance of this store.
         * @name Neo4jStore#_execute
         * @param {(string|string[])} query Query in the cypher query language.
         * @returns {(object|object[])} The result of the query, as retrieved from Neo4j.
         * @async
         */
        async _execute(query) {
            let
                session = this.data.driver.session(),
                result = null;

            if (typeof query === 'string') {
                result = await session.run(query);
            } else if (Array.isArray(query) && query.every(singleQuery => typeof singleQuery === 'string')) {
                result = await Promise.all(query.map(singleQuery => session.run(singleQuery)));
            } else {
                throw new Error(`Neo4jStore#execute(query) -> query has to be a string or an array of strings`);
            }

            return result;
        } // Neo4jStore#_execute

    } // Neo4jStore

    Utility.getPublicClass(Neo4jStore);
    return Neo4jStore;

})(/* closure */); // exports.Neo4j

exports.Redis = ((/* closure */) => {

    let Redis;

    class RedisStore extends DataStore {
        constructor() {
            throw new Error(`RedisStore#constructor() -> not implemented jet`);

            super();
            if (!Redis) Redis = null;

            this.ping().catch(console.error);
        } // RedisStore#constructor
    } // RedisStore

    Utility.getPublicClass(RedisStore);
    return RedisStore;

})(/* closure */); // exports.Redis

exports.MongoDB = ((/* closure */) => {

    let MongoDB;

    async function createClient() {
        return await Utility.promify(MongoDB.connect, `mongodb://${this.param.host}`, { useNewUrlParser: true });
    } // MongoStore~createClient

    class MongoStore extends DataStore {

        constructor(host = "localhost:27017", dbName = "DataStore") {
            if (!MongoDB) MongoDB = require('mongodb').MongoClient;
            super();

            Object.defineProperties(this.param, {
                host: {
                    value: Utility.validParam('string', host)
                },
                dbName: {
                    value: Utility.validParam('string', dbName)
                }
            });

            this.ping().catch(console.error);
        } // MongoStore#constructor

        async ping() {
            let client = await createClient.call(this);
            client.close();
            this.data.valid = true;
            return `MongoStore#ping() -> ping was successful`;
        } // MongoStore#ping

        async _retrieve(...retrieveObjects) {
            if (Array.isArray(retrieveObjects[0]))
                retrieveObjects = retrieveObjects[0];

            let
                client = await createClient.call(this),
                dataBase = client.db(this.param.dbName),
                result;

            // TODO MongoStore -> soll ich aus @type echt direct auf die collection schließen?

            result = await Promise.all(retrieveObjects.map((obj) => new Promise((resolve, reject) => {
                if (!obj || typeof obj !== 'object')
                    return resolve({
                        '@type': "Error",
                        '@value': new Error(`MongoStore#_retrieve(obj) -> obj has to be an object`)
                    });
                if (typeof obj['@type'] !== 'string')
                    return resolve({
                        '@type': "Error",
                        '@value': new Error(`MongoStore#_retrieve(obj) -> obj['@type'] has to be a string to identify the collection`)
                    });

                dataBase.collection(obj['@type']).find(obj).toArray((err, docs) => {
                    if (err) {
                        resolve({
                            '@type': "Error",
                            '@value': err
                        });
                    } else {
                        docs.forEach(element => {
                            delete element['_id'];
                        });

                        if (docs.length === 0) {
                            resolve(null);
                        } else if (docs.length === 1) {
                            resolve(docs[0]);
                        } else {
                            resolve({
                                '@type': "@set",
                                '@value': docs
                            });
                        }
                    };
                });
            })));

            client.close();
            return result;
        } // MongoStore#_retrieve

        async _submit(...submitObjects) {
            let
                client = await createClient.call(this),
                dataBase = client.db(this.param.dbName),
                result;

            result = await Promise.all(submitObjects.map((obj) => new Promise((resolve, reject) => {
                if (typeof obj['@type'] !== 'string')
                    return resolve(null);

                // TODO MongoStore#submit
            })));

            client.close();
            return result;
        } // MongoStore#_submit

    } // MongoStore

    Utility.getPublicClass(MongoStore);
    return MongoStore;

})(/* closure */); // exports.MongoDB
