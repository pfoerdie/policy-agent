const Neo4j = require("neo4j-driver").v1;
const { tools: _ } = _package = require("..");
module.exports = connect;

/** 
 * @function connect
 * @param {string} [hostname="localhost"]
 * @param {string} [username="neo4j"]
 * @param {string} [password="neo4j"]
 * @public
 */
function connect(hostname = "localhost", username = "neo4j", password = "neo4j") {

    _.log(_package.repo, "connect", hostname, username, password);
    const data = _package.private(_package.repo);
    _.assert(!data.driver, "already connected");
    _.assert(_.is.string(hostname) && _.is.string(username) && _.is.string(password), "invalid arguments");

    data.driver = Neo4j.driver("bolt://" + hostname, Neo4j.auth.basic(username, password));

} // connect