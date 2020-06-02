const { util: _ } = $ = require("../index.js");

/** 
 * @param {...string} pathSegments
 * @returns {function}
 */
module.exports = function requireQuery(...pathSegments) {
    const file = new _.file(...pathSegments);
    return $.repo.bindQuery(file.openSync().toString());
}