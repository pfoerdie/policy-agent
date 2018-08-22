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
        super('DataStore');

        if (!new.target || new.target === DataStore)
            this.throw('constructor', "function is abstract");

        let DataStore_connected = false;

        Object.defineProperties(this.data, {
            connected: {
                get: () => DataStore_connected
            }
        });

        setImmediate(() => {
            this.ping().then((result) => {
                DataStore_connected = true;
            }).catch((err) => {
                this.throw('constructor', `connection failed`);
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

        if (V8n().not.arrSchema([
            V8n().string(), // host
            V8n().string(), // user
            V8n().string() // password
        ]).test(arguments)) {
            this.throw('constructor', new TypeError(`invalid arguments`));
        } // argument validation

        Object.defineProperties(this.data, {
            host: {
                value: host
            },
            driver: {
                value: Neo4j.driver(`bolt://${host}`, Neo4j.auth.basic(user, password))
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
        if (!this.data.connected)
            this.throw('_execute', new Error(`not connected`));

        let
            session = this.data.driver.session(),
            result = null;

        if (V8n().not.arrSchema([
            V8n().passesAnyOf(
                V8n().string(),
                V8n().array().every.string()
            ) // query
        ]).test(arguments)) {
            this.throw('_execute', new TypeError(`invalid arguments`));
        } // argument validation

        if (V8n().string().test(query)) {
            result = await session.run(query);
        } else {
            result = await Promise.all(query.map(singleQuery => session.run(singleQuery)));
        }

        return result;
    } // Neo4jStore#_execute

} // Neo4jStore

function MongoStore_createClient() {
    return new Promise((resolve, reject) => {
        MongoDB.connect(`mongodb://${this.data.host}`, { useNewUrlParser: true }, (err, result) => {
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

        if (V8n().not.arrSchema([
            V8n().string(), // host
            V8n().string() // dbName
        ]).test(arguments)) {
            this.throw('constructor', new TypeError(`invalid arguments`));
        } // argument validation

        Object.defineProperties(this.data, {
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
        if (!this.data.connected)
            this.throw('_retrieve', new Error(`not connected`));

        let
            client = await MongoStore_createClient.call(this),
            dataBase = client.db(this.data.dbName),
            result;

        if (V8n().not.arrSchema([
            // TODO query
        ]).test(arguments)) {
            this.throw('_retrieve', new TypeError(`invalid arguments`));
        } // argument validation

        // TODO implementieren -> an Neo4jStore#_execute orientieren

    } // MongoStore#_retrieve

    /**
     * TODO jsDoc
     */
    async _submit(query) {
        if (!this.data.connected)
            this.throw('_submit', new Error(`not connected`));

        let
            client = await MongoStore_createClient.call(this),
            dataBase = client.db(this.data.dbName),
            result;

        if (V8n().not.arrSchema([
            // TODO query
        ]).test(arguments)) {
            this.throw('_submit', new TypeError(`invalid arguments`));
        } // argument validation

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