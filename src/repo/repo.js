const Neo4j = require("neo4j-driver").v1;
const _ = require("../tools");
_.define(exports, "id", "PolicyAgent.repo");
const _module = require("..");

/**
 * @type {Neo4j~driver}
 * @private
 */
let _driver = null;

/**
 * @name connected
 * @type {boolean}
 * @public
 */
_.enumerate(exports, "connected", null, () => !!_driver);

/** 
 * @function connect
 * @param {string} [hostname="localhost"]
 * @param {string} [username="neo4j"]
 * @param {string} [password="neo4j"]
 * @public
 */
_.enumerate(exports, "connect", function connect(hostname = "localhost", username = "neo4j", password = "neo4j") {

    _.log(exports, "connect", hostname, username, password);
    _.assert(!_driver, "already connected");
    _.assert(_.is.string(hostname) && _.is.string(username) && _.is.string(password), "invalid arguments");

    _driver = Neo4j.driver("bolt://" + hostname, Neo4j.auth.basic(username, password));

}); // exports.connect
_.define(exports.connect, "id", "PolicyAgent.repo.connect");

/** 
 * @function disconnect
 * @public
 */
_.enumerate(exports, "disconnect", function disconnect() {

    _.log(exports, "disconnect");
    _.assert(_driver, "not connected");

    _driver.close();
    _driver = null;

}); // exports.disconnect
_.define(exports.disconnect, "id", "PolicyAgent.repo.disconnect");

/** 
 * @function ping
 * @returns {Neo4j~ServerInfo}
 * @async
 * @public
 */
_.enumerate(exports, 'ping', async function ping() {

    _.log(exports, "ping");
    _.assert(_driver, "not connected");

    let session = _driver.session();
    try {
        let result = await session.run("RETURN null");
        session.close();
        return result.summary.server;
    } catch (err) {
        session.close();
        throw err;
    }

}); // exports.ping
_.define(exports.ping, "id", "PolicyAgent.repo.ping");

/** 
 * @function query
 * @returns {*}
 * @async
 * @private
 */
_.define(exports, 'query', async function query(cypher, param = null) {

    _.log(exports, "query");
    _.assert(_driver, "not connected");
    _.assert.string(cypher, 1);
    _.assert.object(param);

    let session = _driver.session();
    try {
        let result = await session.run(cypher, param);
        session.close();
        return result.records.map(record => new Record(record));
    } catch (err) {
        _.log(err);
        session.close();
        throw err;
    }

}); // exports.query
_.define(exports.query, "id", "PolicyAgent.repo.query");

/**
 * @name Record
 * @param {Neo4j~Record} record 
 * @constructor
 * @private
 */
function Record(record) {
    _.assert(new.target === Record, "Record is a constructor");
    for (let key of record['keys']) {
        _.enumerate(this, key, record['_fields'][record['_fieldLookup'][key]]);
    }
}