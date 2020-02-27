const { util: _ } = _package = require("..");
module.exports = disconnect;

/** 
 * @function repo.disconnect
 * @public
 */
function disconnect() {

    _.log(_package.repo, "disconnect");
    const _private = _.private(_package.repo);
    _.assert(_private.driver, "not connected");

    _private.driver.close();
    _private.driver = null;

}