/**
 * @module PolicyAgent~DataStore
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    V8n = require('v8n');

let Neo4j, MongoDB;

/**
 * @name DataStore
 * @extends PolicyAgent~SystemComponent
 */
class DataStore extends SystemComponent {
    /**
     * @constructs DataStore
     * @public
     * @abstract
     */
    constructor() {
        super();

        if (!new.target || new.target === DataStore)
            this.throw('constructor', "function is abstract");

        Object.defineProperties(this.data, {
            connected: {
                writable: true,
                value: false
            }
        });

        setImmediate(() => {
            this.ping().then((result) => {
                this.data.connected = true;
            }).catch((err) => {
                this.data.connected = false;
            });
        });
    } // DataStore#constructor

    /**
     * @name DataStore#ping
     * @throws {Error} Throw an error on failed ping.
     * @returns {*} Optionally a summary of the ping.
     * @async
     * @abstract
     */
    async ping() {
        this.throw('ping', "function is a placeholder");
    } // DataStore#ping

} // DataStore

/**
 * @name Neo4jStore
 * @extends DataStore
 */
class Neo4jStore extends DataStore {
    /**
     * @param {string} [host="localhost"] Hostname of the Neo4j instance.
     * @param {string} [user="neo4j"] Username to access the Neo4j instance.
     * @param {string} [password="neo4j"] Password of the User.
     * @constructs Neo4jStore
     * @public
     */
    constructor(host = "localhost:7687", user = "neo4j", password = "neo4j") {
        if (!Neo4j) Neo4j = require('neo4j-driver').v1;

        super();

        V8n().string().check(host);
        V8n().string().check(user);
        V8n().string().check(password);

        Object.defineProperties(this.param, {
            host: {
                value: host
            },
            user: {
                value: user
            },
            password: {
                value: password
            }
        });

        Object.defineProperties(this.data, {
            driver: {
                value: Neo4j.driver(`bolt://${this.param.host}`, Neo4j.auth.basic(this.param.user, this.param.password))
            }
        });

    } // Neo4jStore#constructor

    /**
     * Sends a basic request to Neo4j to test the connection and login credentials.
     * @name Neo4jStore#ping
     * @throws {Error} Throws if the connection failed.
     * @returns {Neo4j~ServerInfo} Server info returned by Neo4j.
     * @async
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

        if (V8n().string().test(query)) {
            result = await session.run(query);
        } else {
            V8n().array().every.string().check(query);
            result = await Promise.all(query.map(singleQuery => session.run(singleQuery)));
        }

        return result;
    } // Neo4jStore#_execute

} // Neo4jStore

function MongoStore_createClient() {
    return new Promise((resolve, reject) => {
        MongoDB.connect(`mongodb://${this.param.host}`, { useNewUrlParser: true }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
} // MongoStore~createClient

/**
 * @name MongoStore
 * @extends DataStore
 */
class MongoStore extends DataStore {
    /**
     * @param {string} [host="localhost:27017"] Hostname of the MongoDB instance.
     * @param {string} [dbName="DataStore"] Name of the database to use.
     * @constructs MongoStore
     */
    constructor(host = "localhost:27017", dbName = "DataStore") {
        if (!MongoDB) MongoDB = require('mongodb').MongoClient;

        super();

        V8n().string().check(host);
        V8n().string().check(dbName);

        Object.defineProperties(this.param, {
            host: {
                value: host
            },
            dbName: {
                value: dbName
            }
        });
    } // MongoStore#constructor

    /**
     * Creates a client to MongoDB to test the connection.
     * @name MongoStore#ping
     * @throws {Error} Throws if the connection failed.
     * @returns {string} Just some placeholder string.
     * @async
     */
    async ping() {
        let client = await MongoStore_createClient.call(this);
        client.close();

        return "ping successful";
    } // MongoStore#ping
    /**
     * TODO jsDoc
     */
    async _retrieve(query) {
        let
            client = await MongoStore_createClient.call(this),
            dataBase = client.db(this.param.dbName),
            result;

        // TODO implementieren -> an Neo4jStore#_execute orientieren

    } // MongoStore#_retrieve

    /**
     * TODO jsDoc
     */
    async _submit(query) {
        let
            client = await MongoStore_createClient.call(this),
            dataBase = client.db(this.param.dbName),
            result;

        // TODO implementieren

    } // MongoStore#_submit

} // MongoStore

Object.defineProperties(DataStore, {
    /**
     * @name DataStore.Neo4j
     * @type {class} Neo4jStore
     * @static
     */
    Neo4j: {
        value: Neo4jStore
    },
    /**
     * @name DataStore.MongoDB
     * @type {class} MongoStore
     * @static
     */
    MongoDB: {
        value: MongoStore
    }
});

module.exports = DataStore;