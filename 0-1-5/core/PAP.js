/**
 * Policy Administration Point
 * @module PolicyAgent.PAP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    Neo4j = require('neo4j-driver').v1,
    PolicyPoint = require('./PolicyPoint.js');

/**
 * @name PAP
 * @extends PolicyPoint
 */
class PAP extends PolicyPoint {
    /**
     * @constructs PAP
     * @param {JSON} [options={}]
     * @param {string} [options.host="localhost"]
     * @param {number} [options.port=7687]
     * @param {string} [options.user="neo4j"]
     * @param {string} [options.password="neo4j"]
     */
    constructor(options = {}) {
        super(options);

        if (!options || typeof options !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));

        const connection = {
            host: (options['host'] || "localhost") + ":" + (options['port'] || 7687),
            user: options['user'] || "neo4j",
            password: options['password'] || "neo4j"
        };

        this.data.driver = Neo4j.driver(
            `bolt://${connection.host}`,
            Neo4j.auth.basic(connection.user, connection.password)
        );
    } // PAP.constructor

    /**
     * @name PAP#ping
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
    } // PAP#ping

    /**
     * @name PAP#_request
     * @param {(string|string[])} query Query in the cypher query language.
     * @returns {*} Result of the request to Neo4j.
     * @async
     * @package
     */
    async _request(query) {
        const queryArr = Array.isArray(query) ? query : null;

        if (typeof query !== 'string' || (queryArr && queryArr.some(query => typeof query !== 'string')))
            this.throw('_request', new TypeError(`invalid argument`));

        try {
            let
                session = this.data.driver.session(),
                result = queryArr
                    ? await Promise.all(queryArr.map(query => session.run(query)))
                    : await session.run(query);

            session.close();

            // TODO überdenken
            // IDEA result bereinigen

            const resultArr = queryArr ? result : null;

            return resultArr
                ? resultArr.map(_resolveQueryResult)
                : _resolveQueryResult(result);
        } catch (err) {
            this.throw('_request', err);
        }
    } // PAP#_request

} // PAP

module.exports = PAP;