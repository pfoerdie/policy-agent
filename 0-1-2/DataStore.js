/**
 * @module PolicyAgent~DataStore
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js"));

exports.Neo4j = ((/* closure */) => {

    let Neo4j;

    function createDriver() {
        return Neo4j.driver(`bolt://${this.param.host}`, Neo4j.auth.basic(this.param.user, this.param.password));
    } // Neo4jStore~createDriver

    class Neo4jStore {

        /**
         * @param {string} [host="localhost"] Hostname of the Neo4j instance.
         * @param {string} [user="neo4j"] Username to access the Neo4j instance.
         * @param {string} [password="neo4j"] Password of the User.
         * @constructor
         */
        constructor(host = "localhost:7687", user = "neo4j", password = "neo4j") {
            if (!Neo4j) Neo4j = require('neo4j-driver').v1;

            this.param = {
                host: Utility.validParam('string', host),
                user: Utility.validParam('string', user),
                password: Utility.validParam('string', password)
            };
            this.data = {};
            this.data.driver = createDriver.call(this);
        } // Neo4jStore#constructor

        /**
         * Sends a basic request to Neo4j to test the connection and login credentials.
         * @returns {Neo4j~ServerInfo} Server info returned by Neo4j.
         */
        async ping() {
            const
                session = this.data.driver.session(),
                result = await session.run(`RETURN NULL`);

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

    class RedisStore {
        constructor() {
            throw new Error(`RedisStore#constructor() -> not implemented jet`);
            if (!Redis) Redis = null;
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

    class MongoStore {

        constructor(host = "localhost:27017", dbName = "DataStore") {
            if (!MongoDB) MongoDB = require('mongodb').MongoClient;

            this.param = {
                host: Utility.validParam('string', host),
                dbName: Utility.validParam('string', dbName)
            };
            this.data = {};
        } // MongoStore#constructor

        async ping() {
            let client = await createClient.call(this);
            client.close();
            return `MongoStore#ping() -> ping was successful`;
        } // MongoStore#ping

        async _retrieve(...retrieveObjects) {
            if (Array.isArray(retrieveObjects[0]))
                retrieveObjects = retrieveObjects[0];

            let
                client = await createClient.call(this),
                dataBase = client.db(this.param.dbName),
                result;

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
                                '@set': docs
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
