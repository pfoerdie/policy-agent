/**
 * @module PolicyAgent.admin
 * @author Simon Petrac
 */

const _ = require("./tools.js");
const _module = require(".");

_.define(exports, "id", "PolicyAgent.admin");

_.enumerate(exports, "login", async function login() {

    _.log(exports, "login");
    _.assert(_module.repo.connected, "repo not connected");

    // TODO 

}); // exports.login

_.define(exports.login, "id", "PolicyAgent.admin.login");