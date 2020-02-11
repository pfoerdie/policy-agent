const _ = require("../tools.js");
_.define(exports, "id", "PolicyAgent.admin");
const _module = require("..");

/**
 * @function login
 * TODO
 */
_.enumerate(exports, "login", async function login(username, password) {

    _.log(exports, "login");
    _.assert(_module.repo.connected, "repo not connected");

    // TODO 

}); // exports.login
_.define(exports.login, "id", "PolicyAgent.admin.login");

/**
 * @function audit
 * TODO
 */
_.define(exports, "audit", async function audit(...args) {

    // _.log(exports, "audit", ...args);
    let log = _.log(...args);
    // console.log(log);
    // TODO

}); // exports.audit
_.define(exports.audit, "id", "PolicyAgent.admin.audit");