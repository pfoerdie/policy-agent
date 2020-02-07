/**
 * @module PolicyAgent.decide
 * @author Simon Petrac
 */

const _ = require("./tools.js");
const _module = require(".");
module.exports = decide;

async function decide() {

    _.log(_module, "decide");
    _.assert(_module.repo.connected, "repo not connected");

    // TODO

} // decide

_.define(decide, "id", "PolicyAgent.decide");