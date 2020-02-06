/**
 * @module PolicyAgent.exec
 * @author Simon Petrac
 */

const _ = require("./tools.js");
const _module = require("./index.js");

_.define(exports, "id", "PolicyAgent.exec");

/**
 * @function enforce
 * @param {function} action
 * @returns {boolean}
 * @public
 * @async
 */
_.enumerate(exports, "register", async function register(action) {

    _.log(exports, "register", action);

    // TODO 

}); // exports.register

_.define(exports.register, "id", "PolicyAgent.exec.register");