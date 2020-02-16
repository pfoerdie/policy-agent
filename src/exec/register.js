const { util: _ } = _package = require("..");
module.exports = register;

/**
 * @function exec.register
 * @param {function} action
 * @returns {boolean}
 * @public
 * @async
 */
function register(action) {

    _.log(_package.exec, "register", action);
    _.assert(_.is.function(action) && _.is.string.nonempty(action.id), "invalid action");

    // TODO 

} // register