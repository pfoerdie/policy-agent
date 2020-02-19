const { util: _ } = package = require("..");
module.exports = setup;

/**
 * @function admin.setup
 * TODO
 */
async function setup() {

    _.log(package.admin, "setup");

    _.log("Setup indices and constraints.");
    await package.admin.setupConstraints();

    _.log("Setup basic nodes.");
    await package.admin.setupNodes();

}