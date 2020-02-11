/**
 * @module PolicyAgent
 * @author Simon Petrac
 */

const _ = require("./tools");

const Package = require("./Package.js");
const _package = new Package("PolicyAgent", __dirname);
module.exports = _package;

_package.define("tools", _);

require("./enforce");
require("./exec");
require("./decide");
require("./info");
require("./repo");
require("./admin");