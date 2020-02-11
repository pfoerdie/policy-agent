/**
 * @module PolicyAgent.exec
 * @author Simon Petrac
 */

const { tools: _ } = _package = require("..");
module.exports = _package.construct("exec", __dirname);

_package.exec.require("register", "./register.js");