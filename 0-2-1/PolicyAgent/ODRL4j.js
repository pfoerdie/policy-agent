/** {@link https://www.w3.org/TR/odrl-model/#infoModel ODRL Information Model} */

const _ = require("./tools.js");

let _driver = null;

Object.defineProperty(exports, 'driver', {
    get: () => _driver,
    set: (value) => { _driver = value || null }
});

class Asset {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _.define(this, 'attributes', {});
        _.define(this, 'partOf', []);
    } // Asset#constructor

    static async find(param) {
        let queryResult = await _requestNeo4j(Asset._findQuery, { param });
        if (queryResult.length !== 1) return null;
        return new Asset(queryResult[0].result);
    } // Asset.find

} // Asset

// TODO combine the two search queries in a performant way

_.define(Asset, '_findQuery', _.normalizeStr(`
MATCH (result:ODRL:Asset)
WHERE (exists($param["@id"]) AND $param["@id"] = result.uid)
OR all(
    key in keys($param)
    WHERE (key = "@type" AND $param[key] = "Asset")
    OR $param[key] = result[key]
)
RETURN result
`));

_.define(Asset, '_findByIdQuery', _.normalizeStr(`
MATCH (result:ODRL:Asset {uid: $param["@id"]})
WHERE param["@type"] = "Asset"
RETURN result
`));

class AssetCollection extends Asset {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    } // AssetCollection#constructor

    static async find(param) {
        let queryResult = await _requestNeo4j(AssetCollection._findQuery, { param });
        if (queryResult.length !== 1) return null;
        return new AssetCollection(queryResult[0].result);
    } // AssetCollection.find

} // AssetCollection

_.define(AssetCollection, '_findQuery', _.normalizeStr(`
MATCH (result:ODRL:AssetCollection)
WHERE 
    $param["@type"] = "AssetCollection"
    AND ($param["@id"] = result.uid OR $param.uid = result.uid)
RETURN result
`));

class Party {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _.define(this, 'attributes', {});
        _.define(this, 'partOf', []);
    } // Party#constructor

    static async find(param) {
        let queryResult = await _requestNeo4j(Party._findQuery, { param });
        if (queryResult.length !== 1) return null;
        return new Party(queryResult[0].result);
    } // Party.find

} // Party

_.define(Party, '_findQuery', _.normalizeStr(`
MATCH (result:ODRL:Party)
WHERE all(
    key in keys($param)
    WHERE (key = "@type" AND $param[key] = "Party")
    OR (key = "@id" AND $param[key] = result.uid)
    OR $param[key] = result[key]
)
RETURN result
`));

class PartyCollection extends Party {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    } // PartyCollection#constructor

    static async find(param) {
        let queryResult = await _requestNeo4j(PartyCollection._findQuery, { param });
        if (queryResult.length !== 1) return null;
        return new PartyCollection(queryResult[0].result);
    } // PartyCollection.find

} // PartyCollection

_.define(PartyCollection, '_findQuery', _.normalizeStr(`
MATCH (result:ODRL:PartyCollection)
WHERE 
    $param["@type"] = "PartyCollection"
    AND ($param["@id"] = result.uid OR $param.uid = result.uid)
RETURN result
`));

class Action {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    } // Action#constructor

} // Action

class Policy {

    constructor(param) {
        _.assert(new.target !== Policy, "Policy is an abstract class.");
        _.assert(param);
        throw new Error("not implemented jet");
    } // Policy#constructor

    static async find(param) {
        let queryResult = await _requestNeo4j(Policy._findQuery, { param });
        if (queryResult.length !== 1) return null;
        return Policy.construct(queryResult[0].result);
    } // Policy.find

    static construct(param) {
        // TODO create the right policy out of param
    } // Policy.construct

} // Policy

_.define(Policy, '_findQuery', _.normalizeStr(`
MATCH (result:ODRL:Policy)
WHERE 
    any(type IN labels(result) WHERE $param["@type"] = type AND NOT type = "ODRL")
    AND ($param["@id"] = result.uid OR $param.uid = result.uid)
RETURN result
`)); // Policy._findQuery

class Set extends Policy {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    } // Set#constructor

} // Set

class Offer extends Policy {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    } // Offer#constructor

} // Offer

class Agreement extends Policy {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    } // Agreement#constructor

} // Agreement

class ConflictTerm {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    } // ConflictTerm#constructor

} // ConflictTerm

class Rule {

    constructor(param) {
        _.assert(new.target !== Rule, "Rule is an abstract class.");
        _.assert(param);
        throw new Error("not implemented jet");
    } // Rule#constructor

} // Rule

class Permission extends Rule {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    } // Permission#constructor

} // Permission

class Prohibition extends Rule {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    } // Prohibition#constructor

} // Prohibition

class Duty extends Rule {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    } // Duty#constructor

} // Duty

class Constraint {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    } // Contraint#constructor

} // Contraint

class LogicalConstraint {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    } // LogicalContraint#constructor

} // LogicalContraint

class Operator {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    } // Operator#constructor

} // Operator

class LeftOperand {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    } // LeftOperand#constructor

} // LeftOperand

class RightOperand {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    } // RightOperand#constructor

} // RightOperand

function Record(record) {
    _.assert(new.target === Record);
    for (let key of record['keys']) {
        _.enumerate(this, key, record['_fields'][record['_fieldLookup'][key]]);
    }
} // Record.constructor

async function _requestNeo4j(query, param = null) {
    _.assert(_driver);

    if (Array.isArray(query)) {
        _.assert(query.every(entry => Array.isArray(entry) && typeof entry[0] === 'string' && (!entry[1] || typeof entry[1] === 'object')));
        let
            session = _driver.session(),
            result = await Promise.all(query.map(([query, param = null]) => session.run(query, param)));

        session.close();
        return result.map(result => result['records'].map(record => new Record(record)));
    } else {
        _.assert(typeof query === 'string');
        _.assert(typeof param === 'object');

        let
            session = _driver.session(),
            result = await session.run(query, param);

        session.close();
        return result['records'].map(record => new Record(record));
    }
} // _requestNeo4j

Object.assign(exports, {
    Asset,
    AssetCollection,
    Party,
    PartyCollection,
    Action,
    Policy,
    Set,
    Offer,
    Agreement,
    ConflictTerm,
    Rule,
    Permission,
    Prohibition,
    Duty,
    Constraint,
    LogicalConstraint,
    Operator,
    LeftOperand,
    RightOperand
}); // exports
