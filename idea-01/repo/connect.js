const neo4j = require("Neo4j").v1;
const { util: _ } = $ = require("../index.js");
const repo_cache = _.cache.match($.repo);

/** 
 * @param {string} [hostname="localhost"]
 * @param {string} [username="neo4j"]
 * @param {string} [password="neo4j"]
 */
module.exports = function connect(hostname = "localhost", username = "neo4j", password = "neo4j") {

    _.assert(!repo_cache.driver, "already connected");
    _.assert(_.is.string(hostname) && _.is.string(username) && _.is.string(password), "invalid arguments");

    repo_cache.driver = neo4j.driver("bolt://" + hostname, neo4j.auth.basic(username, password));

};