/**
 * @module PolicyAgent
 * @author Simon Petrac
 */

const Module = require("./Module.js");
const _package = new Module("PolicyAgent", __dirname);
module.exports = _package;

require("./util");
require("./enforce");
require("./exec");
require("./decide");
require("./info");
require("./repo");
require("./admin");