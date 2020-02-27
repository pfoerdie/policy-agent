/**
 * @module PolicyAgent
 * @author Simon Petrac
 */

const Module = require("./Module.js");
const _package = new Module("PolicyAgent", __dirname);
module.exports = _package;

require("./util");
require("./repo");
require("./admin");
require("./exec");
require("./info");
require("./decide");
require("./enforce");