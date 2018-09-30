/**
 * Policy Administration Point
 * @module PolicyAgent.PAP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    Neo4j = require('neo4j-driver').v1,
    PolicyPoint = require('./PolicyPoint.js');

//#region GenericPAP

/**
 * @name GenericPAP
 * @extends PolicyPoint
 */
class GenericPAP extends PolicyPoint {
    /**
     * @constructs GenericPAP
     * @param {JSON} [options={}]
     * @param {string} [options.host="localhost:7687"]
     * @param {string} [options.user="neo4j"]
     * @param {string} [options.password="neo4j"]
     */
    constructor(options = {}) {
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
    } // GenericPAP.constructor

    /**
     * @name GenericPAP#ping
     * @async
     */
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
    } // GenericPAP#ping

    /**
     * @name GenericPAP#_request
     * @param {(string|string[])} query Query in the cypher query language.
     * @returns {*} Result of the request to Neo4j.
     * @async
     * @package
     */
    async _request(query) {
        const isArray = Array.isArray(query);

        if (typeof query !== 'string' || (isArray && query.some(elem => typeof elem !== 'string')))
            this.throw('_request', new TypeError(`invalid argument`));

        try {
            let
                session = this.data.driver.session(),
                result = isArray
                    ? await Promise.all(query.map(elem => session.run(elem)))
                    : await session.run(query);

            session.close();

            // TODO überdenken

            return isArray
                ? result.map(GenericPAP_resolveQueryResult)
                : GenericPAP_resolveQueryResult(result);
        } catch (err) {
            this.throw('_request', err);
        }
    } // GenericPAP#_request

} // GenericPAP

//#endregion GenericPAP

module.exports = GenericPAP;