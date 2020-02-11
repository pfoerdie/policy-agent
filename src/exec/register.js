const { tools: _ } = _package = require("..");
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
    _.assert(_.is.function(action) && _.is.string(action.id, 1), "invalid action");

    // TODO 

} // register