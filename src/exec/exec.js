const _ = require("../tools");
_.define(exports, "id", "PolicyAgent.exec");
const _module = require("..");

/**
 * @function register
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