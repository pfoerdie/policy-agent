/**
 * @module PolicyAgent.admin
 * @author Simon Petrac
 */

const { tools: _ } = _package = require("..");
module.exports = _package.construct("admin", __dirname);
_package.private.set(_package.admin, {});

_package.admin.define("id", "PolicyAgent.admin");
_package.admin.add("login", "./login.js");
_package.admin.define("login.id", "PolicyAgent.admin.login");
_package.admin.add("audit", "./audit.js");
_package.admin.define("audit.id", "PolicyAgent.admin.audit");