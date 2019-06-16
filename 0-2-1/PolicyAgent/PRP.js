const
    _ = require("./tools.js"),
    _module = require("./package.js"),
    Neo4j = require("neo4j-driver").v1;

const
    _RE_atType = /^\w+(?::\w+)*$/,
    _RE_uid = /^\w+(?::\w+)*$/;

let _driver = null;

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
    try {
        await _requestNeo4j("RETURN NULL");
        return true;
    } catch (err) {
        console.error(err.toString());
        return false;
    }
}); // PRP.ping

// NOTE maybe delete this method at some point
_.enumerate(exports, 'wipeData', async function (confirm = false) {
    _.assert(confirm === true, "wipeData not confirmed");
    await _requestNeo4j(`MATCH (n) DETACH DELETE n`);
    // TODO: 
    await _requestNeo4j(`CREATE CONSTRAINT ON (action:Action) ASSERT action.id IS UNIQUE`);
    await _requestNeo4j(`CREATE CONSTRAINT ON (node:ODRL) ASSERT node.uid IS UNIQUE`);
}); // PRP.wipeData

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

    await _requestNeo4j(_defineActionQuery, { action, includedIn, implies });
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

const _findAssetQuery = _.normalizeStr(`
UNWIND $Asset AS asset
MATCH (result:Asset)
WHERE all(
    key in keys(asset)
    WHERE result[key] = asset[key]
)
RETURN result
    // TODO
`); // _findAssetQuery

const _findPartyQuery = _.normalizeStr(`
UNWIND $Party AS party
MATCH (result:Party)
WHERE all(
    key in keys(party)
    WHERE result[key] = party[key]
)
RETURN result
    // TODO
`); // _findPartyQuery

_.define(exports, '_findInformation', async function (searchArr) {
    _.assert(Array.isArray(searchArr) && searchArr.every(val =>
        val && typeof val === 'object' &&
        _RE_atType.test(val['@type'])
    ));

    let param = { 'Asset': [] };
    for (let search of searchArr) {
        if (param[search['@type']]) {
            let entity = {}, valid = false;
            for (let key in search) {
                if (!key.startsWith('@')) {
                    entity[key] = search[key];
                    valid = true;
                }
            }
            if (valid)
                param[search['@type']].push(entity);
        }
    }

    let recordArr = await _requestNeo4j(_findAssetQuery, param);
    console.log(recordArr);
    // TODO
}); // PRP._findInformation

const _createAssetQuery = _.normalizeStr(`
UNWIND $entities AS entity
CREATE (result:Asset:ODRL)
SET result = entity
RETURN result
`); // _createAssetQuery

_.define(exports, '_createInformation', async function (entities) {
    _.assert(Array.isArray(entities) && entities.every(val =>
        val && typeof val === 'object' &&
        _RE_atType.test(val['@type']) &&
        _RE_uid.test(val['uid'])
    ));

    _.assert(entities.every(val => val['uid'] && typeof val['uid'] === 'string'));
    // TODO
}); // PRP._createInformation

_.define(exports, '_updateInformation', async function (entities) {
    _.assert(Array.isArray(entities) && entities.every(val =>
        val && typeof val === 'object' &&
        _RE_atType.test(val['@type']) &&
        _RE_uid.test(val['uid'])
    ));
    // TODO
}); // PRP._updateInformation

_.define(exports, '_deleteInformation', async function (entities) {
    _.assert(Array.isArray(entities) && entities.every(val =>
        val && typeof val === 'object' &&
        _RE_atType.test(val['@type']) &&
        _RE_uid.test(val['uid'])
    ));
    // TODO
}); // PRP._deleteInformation

// TODO further entity methods

const _retrievePoliciesQuery = _.normalizeStr(`
    // TODO
`); // _retrievePoliciesQuery

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