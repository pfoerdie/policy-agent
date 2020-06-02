const { util: _ } = $ = require("../index.js");

/** 
 * @param {string} cypher
 * @returns {function} sendQuery
 */
module.exports = function bindQuery(cypher) {
    _.assert(cypher);
    if (!_.is.string(cypher)) {
        cypher = cypher.toString();
        _.assert(_.is.string(cypher));
    }
    // cypher = _.minimizeStr(cypher);
    function sendQuery(param) {
        return $.repo.query(cypher, param);
    }
    return sendQuery;
}