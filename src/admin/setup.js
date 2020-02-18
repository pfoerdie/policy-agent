const { util: _ } = package = require("..");
module.exports = setup;

/**
 * @function admin.setup
 * TODO
 */
async function setup() {

    _.log(package.admin, "setup");

    _.log("Delete all nodes!");
    await package.repo.query("MATCH (n) DETACH DELETE n"); // TODO temp

    _.log("Setup indices and constraints.");
    await package.repo.query(package.admin.setupConstraints);

    _.log("Setup basic nodes.");
    await package.repo.query(package.admin.setupNodes);

}