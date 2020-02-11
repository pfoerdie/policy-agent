/**
 * @module PolicyAgent.enforce
 * @author Simon Petrac
 */

const { tools: _ } = _package = require("..");
_package.enforce = require("./enforce.js");
module.exports = _package.enforce;
_package.private.set(_package.enforce, {});

_package.define("enforce.id", "PolicyAgent.enforce");
_package.add("enforce.Context", "./enforce/Context.js");
_package.define("enforce.Context.id", "PolicyAgent.enforce.Context");