const { util: _ } = $ = require("../index.js");
const repo_cache = _.cache.match($.repo);

/**
 * @constructor
 * @param {Neo4j~Record} record 
 */
function Record(record) {
    if (!new.target) return new Record(record);
    for (let key of record['keys']) {
        this[key] = record['_fields'][record['_fieldLookup'][key]];
    }
}

/** 
 * @async
 * @param {string} cypher
 * @param {object} [param=null]
 * @returns {Array<Record>}
 */
module.exports = async function query(cypher, param = null) {

    _.assert(repo_cache.driver, "not connected");
    _.assert(_.is.string(cypher) && cypher.length > 2, "not a string");
    _.assert(_.is.object(param), "not an object");

    const multi = cypher.includes(";");
    if (multi) cypher = cypher.split(";").filter(cyp => cyp.length > 2);

    const session = repo_cache.driver.session();
    try {
        let result = multi
            ? await Promise.all(cypher.map(cyp => session.run(cyp, param)))
            : await session.run(cypher, param);
        session.close();
        // TODO maybe optimize the following by not using map and keeping the original array
        return multi
            ? result.map(res => res.records.map(Record))
            : result.records.map(Record);
    } catch (err) {
        session.close();
        throw err;
    }

};