const { tools: _ } = _package = require("..");
module.exports = query;

/**
 * @name Record
 * @param {Neo4j~Record} record 
 * @constructor
 * @private
 */
function Record(record) {
    _.assert(new.target === Record, "Record is a constructor");
    for (let key of record['keys']) {
        _.enumerate(this, key, record['_fields'][record['_fieldLookup'][key]]);
    }
}

/** 
 * @function query
 * @returns {*}
 * @async
 * @private
 */
async function query(cypher, param = null) {

    _.log(exports, "query");
    const _private = _package.private(_package.repo);
    _.assert(_private.driver, "not connected");
    _.assert.string(cypher, 1);
    _.assert.object(param);

    let session = _private.driver.session();
    try {
        let result = await session.run(cypher, param);
        session.close();
        return result.records.map(record => new Record(record));
    } catch (err) {
        _.log(err);
        session.close();
        throw err;
    }

} // query