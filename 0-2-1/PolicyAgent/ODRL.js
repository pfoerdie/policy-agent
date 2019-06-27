/** {@link https://www.w3.org/TR/odrl-model/#infoModel ODRL Information Model} */

const
    _ = require("./tools.js");

class Asset {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _.define(this, 'attributes', {});
        _.define(this, 'partOf', []);
    } // Asset#constructor

} // Asset

_.define(Asset, 'findQuery', _.normalizeStr(`
MATCH (result:Asset)
WHERE all(
    key in keys($param)
    WHERE (key = "@type" AND $param[key] = "Asset")
    OR (key = "@id" AND $param[key] = result.uid)
    OR $param[key] = result[key]
)
RETURN result
`));

class AssetCollection extends Asset {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    } // AssetCollection#constructor

} // AssetCollection

_.define(AssetCollection, 'findQuery', _.normalizeStr(`
MATCH (result:AssetCollection)
WHERE 
    $param["@type"] = "AssetCollection"
    AND $param["@id"] = result.uid
RETURN result
`));

class Party {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _.define(this, 'attributes', {});
        _.define(this, 'partOf', []);
    } // Party#constructor

} // Party

_.define(Party, 'findQuery', _.normalizeStr(`
MATCH (result:Party)
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

} // PartyCollection

_.define(PartyCollection, 'findQuery', _.normalizeStr(`
MATCH (result:PartyCollection)
WHERE 
    $param["@type"] = "PartyCollection"
    AND $param["@id"] = result.uid
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

} // Policy

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
