/**
 * @module PolicyAgent.exec
 * @author Simon Petrac
 */

const { util: _ } = _package = require("..");
module.exports = _package._construct("exec", __dirname);

_package.exec._require("register", "./register.js");