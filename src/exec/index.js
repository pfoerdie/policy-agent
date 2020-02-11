/**
 * @module PolicyAgent.exec
 * @author Simon Petrac
 */

const { tools: _ } = _package = require("..");
module.exports = _package.construct("exec", __dirname);
_package.private.set(_package.exec, {});

_package.exec.define("id", "PolicyAgent.exec");
_package.exec.add("register", "./register.js");
_package.exec.define("register.id", "PolicyAgent.exec.register");