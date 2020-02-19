const { util: _ } = package = require("..");
module.exports = bindQuery;

/** 
 * @function query
 * @param {string} cypher
 * @returns {function}
 * @async
 * @private
 */
function bindQuery(cypher) {
    _.assert.string(cypher);
    cypher = _.minimizeStr(cypher);
    function sendQuery(param) {
        _.log(sendQuery, "call", param);
        return package.repo.query(cypher, param);
    }
    return sendQuery;
}