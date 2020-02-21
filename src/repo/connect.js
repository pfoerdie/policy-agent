const Neo4j = require("neo4j-driver").v1;
const { util: _ } = package = require("..");
module.exports = connect;

/** 
 * @function repo.connect
 * @param {string} [hostname="localhost"]
 * @param {string} [username="neo4j"]
 * @param {string} [password="neo4j"]
 * @public
 */
function connect(hostname = "localhost", username = "neo4j", password = "neo4j") {

    _.log(package.repo, "connect", hostname, username, password);
    const data = _.private(package.repo);
    _.assert(!data.driver, "already connected");
    _.assert(_.is.string(hostname) && _.is.string(username) && _.is.string(password), "invalid arguments");

    data.driver = Neo4j.driver("bolt://" + hostname, Neo4j.auth.basic(username, password));

}