const
    _ = require("./tools.js"),
    _module = require("./index.js"),
    Neo4j = require("neo4j-driver").v1;

let
    _driver = null;

_.enumerate(exports, 'connect', function (host = "localhost", user = "neo4j", password = "neo4j") {
    _.assert(host && typeof host === 'string');
    _.assert(user && typeof user === 'string');
    _.assert(password && typeof password === 'string');
    _.assert(!_driver, "PRP already connected");
    _driver = Neo4j.driver("bolt://" + host, Neo4j.auth.basic(user, password));
}); // PRP.connect

_.define(exports, 'disconnect', function () {
    _.assert(_driver, "PRP not connected");
    _driver.close();
    _driver = null;
}); // PRP.disconnect

_.defineGetter(exports, 'connected', function () {
    return !!_driver;
}); // PRP.connected

_.enumerate(exports, 'ping', async function () {
    _.assert(_driver, "PRP not connected");
    try {
        let session = _driver.session();
        await session.run("RETURN NULL");
        session.close();
        return true;
    } catch (err) {
        console.error(err.toString());
        return false;
    }
});

_.define(exports, '_retrieveActions', async function (actionID) {
    // TODO
}); // PRP._retrieveActions

_.define(exports, '_retrieveEntities', async function () {
    // TODO
}); // PRP._retrieveEntities

_.define(exports, '_retrievePolicies', async function () {
    // TODO
}); // PRP._retrievePolicies

async function _requestNeo4j(query, param = null) {
    _.assert(_driver);
    _.assert(typeof query === 'string');
    _.assert(typeof param === 'object');

    let
        session = _driver.session(),
        result = await session.run(query, param);

    session.close();
    return result['records'].map(record => {
        let betterRecord = {};
        for (let key of record['keys']) {
            _.enumerate(betterRecord, key, record['_fields'][record['_fieldLookup'][key]]);
        }
        return betterRecord;
    });
} // _requestNeo4j