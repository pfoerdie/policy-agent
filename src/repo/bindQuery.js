const { util: _ } = _package = require("..");
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
        return _package.repo.query(cypher, param);
    }
    return sendQuery;
}