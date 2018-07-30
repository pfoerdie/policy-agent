/**
 * @module PRP
 * @author Simon Petrac
 * 
 * {@link https://www.npmjs.com/package/neo4j-driver neo4j-driver - npm}
 * {@link https://www.npmjs.com/package/apoc apoc - npm}
 * {@link https://www.npmjs.com/package/uuid uuid - npm}
 */

const
    neo4j = require('neo4j-driver').v1,
    mustache = require('mustache'), // https://www.npmjs.com/package/mustache
    PRP = {};

let // private variables
    _driver = null,
    _templates = {};

//#region Templates

_templates.exists = `
MATCH (n:Node {nid: "{{&.}}"})
RETURN true AS n
`; // _templates.exists

_templates.retrieve = `
MATCH (n:ODRL {uid: "{{&.}}"})
OPTIONAL MATCH (n)-[r]->(m:ODRL)
RETURN n, type(r) AS r, m.uid AS m
`; // _templates.retrieve

_templates.submit = `
MERGE (n:ODRL {uid:"{{&uid}}"})
SET
    n:{{&@type}}
`; // _templates.submit

_templates.delete = `
MATCH (n:ODRL {uid: "{{&.}}"})
OPTIONAL MATCH l = (n)-[*]->(m:ODRL)
WHERE none(
    p IN nodes(l) 
    WHERE (:ODRL)-[]->(p)<-[]-(:ODRL)
)
WITH n, m, m.uid AS r
DETACH DELETE n, m
RETURN r
`; // _templates.delete

//#endregion

//#region Functions

function toArray(args) {
    return Array.isArray(args) ? args : args ? [args] : [];
} // toArray

//#endregion

/**
 * This object contains all public methods.
 * @name PRP.public
 * @type {Object}
 */
PRP.public = Object.create({}, {

    /**
     * This function establishes a connection to a neo4j instance and saves the driver to a private variable.
     * @function PRP.public.connect
     * @param {string} host Host adress of the neo4j instance.
     * @param {string} user Username to login to the neo4j instance.
     * @param {string} password Password related to the username.
     * @returns {boolean} Success of the connection.
     * @throws {Error} If this error occurs, the connection could not be established with the given credentials.
     * @async
     */
    'connect': {
        enumerable: true,
        value: async (host, user, password) => {

            let driver = new neo4j.driver(`bolt://${host}`, neo4j.auth.basic(user, password));

            let session = driver.session();
            await session.run("RETURN null");
            session.close();

            _driver = driver;
            return true;

        }
    } // PRP.public.connect

}); // PRP.public

/**
 * TODO
 */
PRP.submit = async () => {

}; // PRP.submit

/**
 * TODO
 */
PRP.update = async () => {

}; // PRP.update

/**
 * TODO
 */
PRP.retrieve = async (...queryData) => {
    queryData = queryData.map((data) => {
        if (typeof data === 'string')
            return {
                'uid': data
            };
        else
            return data;
    });

    let queryResult = await PRP.execute(_templates.retrieve, queryData);
    return queryResult;
}; // PRP.retrieve

/**
 * TODO
 */
PRP.exists = async () => {

}; // PRP.exists

/**
 * TODO
 */
PRP.delete = async () => {

}; // PRP.delete

/**
 * This function creates a request to the neo4j instance.
 * @function PRP.execute
 * @param {(string|string[])} queryTemplates Cypher queries with mustache template syntax.
 * @param {(Object|Object[])} dataViews Data for the query. Used to replace mustaches.
 * @returns {Object} Result of the request to the neo4j driver.
 * @throws {Error} If this error occurs, most likely the neo4j driver is not connected or the cypher query has an invalid format.
 * @async
 */
PRP.execute = async (queryTemplates, dataViews = {}) => {

    let session = _driver.session();

    try {

        let queries = [];
        for (let queryTemplate of toArray(queryTemplates)) {
            for (let dataView of toArray(dataViews)) {
                dataView['ts'] = Date.now();
                let query = mustache.render(queryTemplate, dataView);
                queries.push(session.run(query));
            }
        }

        let result = await Promise.all(queries);
        session.close();
        return result;

    } catch (err) {

        session.close();
        throw err;

    }

}; // PRP.execute

module.exports = PRP;