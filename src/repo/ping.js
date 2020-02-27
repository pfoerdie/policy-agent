const { util: _ } = _package = require("..");
module.exports = ping;

/** 
 * @function repo.ping
 * @returns {Neo4j~ServerInfo}
 * @async
 * @public
 */
async function ping() {

    _.log(_package.repo, "ping");
    const _private = _.private(_package.repo);
    _.assert(_private.driver, "not connected");

    const session = _private.driver.session();
    try {
        const result = await session.run("RETURN null");
        session.close();
        return result.summary.server;
    } catch (err) {
        _.log(err);
        session.close();
        throw err;
    }

}