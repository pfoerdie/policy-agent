const { util: _ } = package = require("..");
module.exports = disconnect;

/** 
 * @function repo.disconnect
 * @public
 */
function disconnect() {

    _.log(package.repo, "disconnect");
    const _private = _.private(package.repo);
    _.assert(_private.driver, "not connected");

    _private.driver.close();
    _private.driver = null;

}