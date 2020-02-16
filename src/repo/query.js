const { util: _ } = package = require("..");
module.exports = query;

/** 
 * @function query
 * @returns {*}
 * @async
 * @private
 */
async function query(cypher, param = null) {

    _.log(package.repo, "query");
    const _private = _.private(package.repo);
    _.assert(_private.driver, "not connected");
    _.assert.string(cypher, 1);
    _.assert.object(param);

    const session = _private.driver.session();
    try {
        let result = await session.run(cypher, param);
        session.close();
        return result.records.map(record => new package.repo.Record(record));
    } catch (err) {
        _.log(err);
        session.close();
        throw err;
    }

} // query