/**
 * @module PolicyAgent.admin
 * @author Simon Petrac
 */

const { util: _ } = _package = require("..");
module.exports = _package._construct("admin", __dirname);

_package.admin._require("login", "./login.js");
_package.admin._require("audit", "./audit.js");