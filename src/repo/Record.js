const { util: _ } = package = require("..");
module.exports = Record;

/**
 * @name repo.Record
 * @param {Neo4j~Record} record 
 * @constructor
 * @private
 */
function Record(record) {
    if (!new.target) return new Record(record);
    for (let key of record['keys']) {
        _.enumerate(this, key, record['_fields'][record['_fieldLookup'][key]]);
    }
}