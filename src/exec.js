/**
 * @module PolicyAgent.exec
 * @author Simon Petrac
 */

const _ = require("./tools.js");
const _module = require(".");

_.define(exports, "id", "PolicyAgent.exec");

/**
 * @function enforce
 * @param {function} action
 * @returns {boolean}
 * @public
 * @async
 */
_.enumerate(exports, "register", function register(action) {

    _.log(exports, "register", action);
    _.assert(_.is.function(action) && _.is.string(action.id, 1), "invalid action");

    // TODO 

}); // exports.register

_.define(exports.register, "id", "PolicyAgent.exec.register");