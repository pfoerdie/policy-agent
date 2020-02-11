/**
 * @module PolicyAgent.enforce
 * @author Simon Petrac
 */

const { tools: _ } = _package = require("..");
module.exports = _package.construct("enforce", __dirname);

_package.enforce.require("Context", "./Context.js");
_package.enforce.require("express", "./express.js");
_package.enforce.require("io", "./io.js");