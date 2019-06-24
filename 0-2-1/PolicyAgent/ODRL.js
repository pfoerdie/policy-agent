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

class AssetCollection extends Asset {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    } // AssetCollection#constructor

} // AssetCollection

class Party {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _.define(this, 'attributes', {});
        _.define(this, 'partOf', []);
    } // Party#constructor

} // Party

class PartyCollection extends Party {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    } // PartyCollection#constructor

} // PartyCollection

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
