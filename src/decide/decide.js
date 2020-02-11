const _ = require("../tools");
module.exports = decide;
_.define(decide, "id", "PolicyAgent.decide");
const _module = require("..");

/**
 * @function decide
 * TODO
 */
async function decide() {

    _.log(_module, "decide");
    _.assert(_module.repo.connected, "repo not connected");

    // TODO

} // decide