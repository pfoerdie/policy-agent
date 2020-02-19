const { util: _ } = package = require("..");
module.exports = query;

/** 
 * @function repo.query
 * @returns {Array<Record>}
 * @async
 * @private
 */
async function query(cypher, param = null) {

    _.log(package.repo, "query");
    const _private = _.private(package.repo);
    _.assert(_private.driver, "not connected");
    _.assert.string(cypher, 3);
    _.assert.object(param);
    const multi = cypher.includes(";");
    if (multi) cypher = cypher.split(";").filter(cyp => cyp.length > 2);

    const session = _private.driver.session();
    try {
        let result = multi
            ? await Promise.all(cypher.map(cyp => session.run(cyp, param)))
            : await session.run(cypher, param);
        session.close();
        // TODO maybe optimize the following by not using map and keeping the original array
        return multi
            ? result.map(res => res.records.map(record => new package.repo.Record(record)))
            : result.records.map(record => new package.repo.Record(record));
    } catch (err) {
        _.log(err);
        session.close();
        throw err;
    }

}