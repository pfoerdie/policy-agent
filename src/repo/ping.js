const { tools: _ } = _package = require("..");
module.exports = ping;

/** 
 * @function ping
 * @returns {Neo4j~ServerInfo}
 * @async
 * @public
 */
async function ping() {

    _.log(_package.repo, "ping");
    const _private = _package.private(_package.repo);
    _.assert(_private.driver, "not connected");

    let session = _private.driver.session();
    try {
        let result = await session.run("RETURN null");
        session.close();
        return result.summary.server;
    } catch (err) {
        _.log(err);
        session.close();
        throw err;
    }

} // ping