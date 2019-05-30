const
    _module = require("./index.js"),
    Neo4j = require("neo4j-driver").v1,
    T = require("./tools.js");

let
    _driver = null;

T.enumerate(exports, 'connect', function (host = "localhost", user = "neo4j", password = "neo4j") {
    T.assert(host && typeof host === 'string');
    T.assert(user && typeof user === 'string');
    T.assert(password && typeof password === 'string');
    T.assert(!_driver, "PRP already connected");
    _driver = Neo4j.driver("bolt://" + host, Neo4j.auth.basic(user, password));
}); // PRP.connect

T.define(exports, 'disconnect', function () {
    T.assert(_driver, "PRP not connected");
    _driver.close();
    _driver = null;
}); // PRP.disconnect

T.defineGetter(exports, 'connected', function () {
    return !!_driver;
}); // PRP.connected

T.enumerate(exports, 'ping', async function () {
    T.assert(_driver, "PRP not connected");
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

T.define(exports, '_retrieveActions', async function () {
    // TODO
}); // PRP._retrieveActions

T.define(exports, '_retrieveEntities', async function () {
    // TODO
}); // PRP._retrieveEntities

T.define(exports, '_retrievePolicies', async function () {
    // TODO
}); // PRP._retrievePolicies