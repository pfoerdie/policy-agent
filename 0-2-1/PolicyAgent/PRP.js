const
    _ = require("./tools.js"),
    _module = require("./package.js"),
    ODRL4j = require('./ODRL4j.js'),
    Neo4j = require("neo4j-driver").v1;

_.enumerate(exports, 'connect', function (host = "localhost", user = "neo4j", password = "neo4j") {
    _.assert(host && typeof host === 'string');
    _.assert(user && typeof user === 'string');
    _.assert(password && typeof password === 'string');
    _.assert(!ODRL4j.driver, "PRP already connected");
    ODRL4j.driver = Neo4j.driver("bolt://" + host, Neo4j.auth.basic(user, password));
}); // PRP.connect

_.define(exports, 'disconnect', function () {
    _.assert(ODRL4j.driver, "PRP not connected");
    ODRL4j.driver.close();
    ODRL4j.driver = null;
}); // PRP.disconnect

_.defineGetter(exports, 'connected', function () {
    return !!ODRL4j.driver;
}); // PRP.connected

_.enumerate(exports, 'ping', async function () {
    _.assert(ODRL4j.driver);
    try {
        let session = ODRL4j.driver.session();
        await session.run("RETURN NULL");
        session.close();
        return true;
    } catch (err) {
        console.error(err.toString());
        return false;
    }
}); // PRP.ping

// NOTE maybe delete this method at some point
_.enumerate(exports, 'wipeData', async function (confirm = false) {
    _.assert(ODRL4j.driver);
    _.assert(confirm === true, "wipeData not confirmed");
    let session = ODRL4j.driver.session();
    await session.run(`MATCH (n) DETACH DELETE n`);
    // TODO: 
    await session.run(`CREATE CONSTRAINT ON (action:Action) ASSERT action.id IS UNIQUE`);
    await session.run(`CREATE CONSTRAINT ON (node:ODRL4j) ASSERT node.uid IS UNIQUE`);
    session.close();
}); // PRP.wipeData

//#region PXP

const _defineActionQuery = _.normalizeStr(`
MERGE (action:Action {id: $action})
    SET action.valid = true

WITH action
    OPTIONAL MATCH (action)-[oldRef:includedIn|:implies]->(:Action)
    DELETE oldRef

WITH DISTINCT action
    FOREACH ( impliesID IN $implies | 
        MERGE (implied:Action {id: impliesID})
        ON CREATE SET implied.valid = false
        CREATE (action)-[:implies]->(implied)
    )

WITH action
    WHERE $includedIn IS NOT NULL
    MERGE (includedIn:Action {id: $includedIn})
    ON CREATE SET includedIn.valid = false
    CREATE (action)-[:includedIn]->(includedIn)
`); // _defineActionQuery

_.enumerate(exports, 'defineAction', async function (action, includedIn, implies = []) {
    if (action === 'use' || action === 'transfer') {
        includedIn = null;
        implies = [];
    } else {
        _.assert(action && typeof action === 'string', "invalid action");
        _.assert(includedIn && typeof includedIn === 'string', "invalid includedIn");
        _.assert(Array.isArray(implies) && implies.every(val => val && typeof val === 'string'), "invalid implies");
    }
    let session = ODRL4j.driver.session();
    await session.run(_defineActionQuery, { action, includedIn, implies });
    session.close();
}); // PRP.defineAction

const _extractActionsQuery = _.normalizeStr(`
MATCH (action:Action {id: $action, valid: true})
    OPTIONAL MATCH (action)-[ref:includedIn|:implies]->(target:Action {valid: true})
    RETURN [action.id, type(ref), target.id] AS result
UNION
MATCH (:Action {id: $action, valid: true})-[refs:includedIn|:implies*]->(action:Action {valid: true})
    OPTIONAL MATCH (action)-[ref:includedIn|:implies]->(target:Action {valid: true})
    RETURN [action.id, type(ref), target.id] AS result
`); // _extractActionsQuery

_.define(exports, '_extractActions', async function (action) {
    _.assert(action && typeof action === 'string', "invalid action");

    let recordArr = await _requestNeo4j(_extractActionsQuery, { action });
    let resultMap = new Map();

    for (let { 'result': [action, refType, target] } of recordArr) {
        let entry = resultMap.get(action);

        if (!entry) {
            entry = { id: action, includedIn: null, implies: [] };
            resultMap.set(action, entry);
        }

        if (refType === 'implies')
            entry.implies.push(target);
        else if (refType === 'includedIn')
            entry.includedIn = target;
    }

    return Array.from(resultMap.values());
}); // PRP._extractActions

//#endregion PXP
//#region PIP

const _findTypes = [
    ODRL4j.Asset,
    ODRL4j.AssetCollection,
    ODRL4j.Party,
    ODRL4j.PartyCollection
];

// IDEA move neo4j calls completely to ODRL4j.js and maybe rename it to ODRL4j4j.js
// or find another solution for the problem of making neo4j calls from ODRL4j instances

_.define(exports, '_find', async function (param = null) {
    _.assert(param && param['@type']);
    const type = _findTypes.find(type => type.name === param['@type']);
    _.assert(type && type.find);
    return type.find(param);
});

//#endregion PIP
//#region PAP

const _retrievePoliciesQuery = _.normalizeStr(`
    // TODO
`); // _retrievePoliciesQuery

_.define(exports, '_retrievePolicies', async function () {
    // TODO
}); // PRP._retrievePolicies

//#endregion PAP

function Record(record) {
    _.assert(new.target === Record);
    for (let key of record['keys']) {
        _.enumerate(this, key, record['_fields'][record['_fieldLookup'][key]]);
    }
} // Record

async function _requestNeo4j(query, param = null) {
    _.assert(ODRL4j.driver);
    _.assert(typeof query === 'string');
    _.assert(typeof param === 'object');

    let
        session = ODRL4j.driver.session(),
        result = await session.run(query, param);

    session.close();
    return result['records'].map(record => new Record(record));
} // _requestNeo4j