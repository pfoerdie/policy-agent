/**
 * @module PolicyAgent.decide
 * @author Simon Petrac
 */

const { tools: _ } = _package = require("..");
_package.decide = require("./decide.js");
module.exports = _package.decide;
_package.private.set(_package.decide, {});

_package.define("decide.id", "PolicyAgent.decide");
// _package.add("decide.temp", "./decide/temp.js");
// _package.define("decide.temp.id", "PolicyAgent.decide.temp");