/** @module PolicyAgent.enforce */

const { util: _ } = _package = require("..");
module.exports = _package._construct("enforce", __dirname);

_package.enforce._require("Context", "./Context.js");
_package.enforce._require("request", "./request.js");
_package.enforce._require("express", "./express.js");
_package.enforce._require("io", "./io.js");