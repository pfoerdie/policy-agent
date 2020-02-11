const { tools: _ } = _package = require("..");
module.exports = disconnect;

/** 
 * @function disconnect
 * @public
 */
function disconnect() {

    _.log(_package.repo, "disconnect");
    const _private = _package.private(_package.repo);
    _.assert(_private.driver, "not connected");

    _private.driver.close();
    _private.driver = null;

} // disconnect