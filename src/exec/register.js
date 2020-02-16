const { util: _ } = package = require("..");
module.exports = register;

/**
 * @function exec.register
 * @param {function} action
 * @returns {boolean}
 * @public
 * @async
 */
function register(action) {

    _.log(package.exec, "register", action);
    _.assert(_.is.function(action) && _.is.string.nonempty(action.id), "invalid action");

    // TODO 

} // register