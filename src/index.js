/**
 * @module PolicyAgent
 * @author Simon Petrac
 */

const Module = require("./Module.js");
const package = new Module("PolicyAgent", __dirname);
module.exports = package;

require("./util");
require("./repo");
require("./admin");
require("./exec");
require("./info");
require("./decide");
require("./enforce");