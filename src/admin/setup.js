const { util: _ } = package = require("..");
module.exports = setup;

/**
 * @function admin.setup
 * TODO
 */
async function setup() {

    _.log(package.admin, "setup");

    await package.repo.query("MATCH (n) DETACH DELETE n"); // TODO temp
    // await package.repo.query(package.admin.setupConstraints);
    await Promise.all(package.admin.setupConstraints.map(query => package.repo.query(query)));
    await package.repo.query(package.admin.setupNodes);

}