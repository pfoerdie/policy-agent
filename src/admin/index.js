/**
 * @module PolicyAgent.admin
 * @author Simon Petrac
 */

const { tools: _ } = _package = require("..");
module.exports = _package.construct("admin", __dirname);

_package.admin.require("login", "./login.js");
_package.admin.require("audit", "./audit.js");