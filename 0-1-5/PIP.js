/**
 * @module PolicyAgent.PIP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    Neo4j = require('neo4j-driver').v1,
    MongoDB = require('mongodb').MongoClient,
    PolicyPoint = require('./PolicyPoint.js'),
    Context = require('./Context.js');

//#region GenericPIP

/**
 * @name GenericPIP
 * @extends PolicyPoint
 */
class GenericPIP extends PolicyPoint {
    /**
     * @constructs GenericPIP
     * @param {JSON} [options={}]
     * @abstract
     * @public
     */
    constructor(options = {}) {
        super(options);

        // TODO
    } // GenericPIP.constructor

} // GenericPIP

//#endregion GenericPIP

//#region AttributeStore

class AttributeStore extends GenericPIP {
    constructor(options) {
        super(options);

        if (!options || typeof options !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));

        const connection = {
            host: options['host'] || "localhost:27017",
            dbName: options['dbName'] || "AttributeStore"
        };

        this.data.driver = {
            client: () => new Promise((resolve, reject) => MongoDB.connect(
                `mongodb://${connection.host}`,
                { useNewUrlParser: true },
                (err, client) => {
                    if (err)
                        reject(err)
                    else {
                        client.db = client.db(connection.dbName);
                        resolve(client);
                    }
                }
            ))
        };
    } // AttributeStore.constructor

    async ping() {
        try {
            const client = await this.data.driver.client();
            client.close();

            this.log('ping', "success");
            return client['s']['options']['servers'][0];
        } catch (err) {
            this.throw('ping', err);
        }
    } // AttributeStore#ping

    async _retrieve() {

    } // AttributeStore#_retrieve

    async _submit() {

    } // AttributeStore#_submit

} // AttributeStore

//#endregion AttributeStore

//#region PolicyStore

class PolicyStore extends GenericPIP {
    constructor(options) {
        super(options);

        if (!options || typeof options !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));

        const connection = {
            host: options['host'] || "localhost:7687",
            user: options['user'] || "neo4j",
            password: options['password'] || "neo4j"
        };

        this.data.driver = Neo4j.driver(
            `bolt://${connection.host}`,
            Neo4j.auth.basic(connection.user, connection.password)
        );
    } // PolicyStore.constructor

    async ping() {
        try {
            const
                session = this.data.driver.session(),
                result = await session.run(`RETURN NULL`);

            session.close();
            this.log('ping', "success");
            return result['summary']['server'];
        } catch (err) {
            this.throw('ping', err);
        }
    } // PolicyStore#ping

    async _request(query) {
        if (Array.isArray(query))
            return await Promise.all(query.map(elem => this._request(elem)));

        if (typeof query !== 'string')
            this.throw('_request', new TypeError(`invalid argument`));

        try {
            let
                session = this.data.driver.session(),
                result = await session.run(query);

            session.close();
            return result;
        } catch (err) {
            this.throw('_request', err);
        }
    } // PolicyStore#_request

} // PolicyStore

//#endregion PolicyStore

Object.defineProperties(GenericPIP, {
    'AttributeStore': {
        enumerable: true,
        value: AttributeStore
    },
    'PolicyStore': {
        enumerable: true,
        value: PolicyStore
    }
});

module.exports = GenericPIP;