const
    Assert = require('assert'),
    Neo4j = require("neo4j-driver").v1,
    _module = require("./index.js"),
    T = require("./tools.js"),
    PRP = {};

let
    _driver = null;

T.enumerate(PRP, 'connect', function (host = "localhost", user = "neo4j", password = "neo4j") {
    Assert(host && typeof host === 'string');
    Assert(user && typeof user === 'string');
    Assert(password && typeof password === 'string');
    Assert(!_driver, "PRP already connected");
    _driver = Neo4j.driver("bolt://" + host, Neo4j.auth.basic(user, password));
}); // PRP.connect

T.define(PRP, 'disconnect', function () {
    Assert(_driver, "PRP not connected");
    _driver.close();
    _driver = null;
}); // PRP.disconnect

T.defineGetter(PRP, 'connected', function () {
    return !!_driver;
}); // PRP.connected

T.enumerate(PRP, 'ping', async function () {
    Assert(_driver, "PRP not connected");
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

T.define(PRP, '_retrieveActions', async function () {
    // TODO
}); // PRP._retrieveActions

T.define(PRP, '_retrieveEntities', async function () {
    // TODO
}); // PRP._retrieveEntities

T.define(PRP, '_retrievePolicies', async function () {
    // TODO
}); // PRP._retrievePolicies

module.exports = PRP;