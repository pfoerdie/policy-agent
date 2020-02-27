const { util: _ } = _package = require("..");
module.exports = setup;

/**
 * @function admin.setup
 * TODO
 */
async function setup() {

    _.log(_package.admin, "setup");

    _.log("Setup indices and constraints.");
    await _package.admin.setupConstraints();

    _.log("Setup basic nodes.");
    await _package.admin.setupNodes();

}