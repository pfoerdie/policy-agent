/** {@link https://www.w3.org/TR/odrl-model/#infoModel ODRL Information Model} */

const
    _ = require("./tools.js"),
    _module = require("./package.js"),
    _private = new WeakMap();

class Asset {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _private.set(this, {});
    } // Asset#constructor

} // Asset

class AssetCollection extends Asset {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
        _private.set(this, {});
    } // AssetCollection#constructor

} // AssetCollection

class Party {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _private.set(this, {});
    } // Party#constructor

} // Party

class PartyCollection extends Party {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
        _private.set(this, {});
    } // PartyCollection#constructor

} // PartyCollection

class Action {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _private.set(this, {});
    } // Action#constructor

} // Action

class Policy {

    constructor(param) {
        _.assert(new.target !== Policy, "Policy is an abstract class.");
        _.assert(param);
        throw new Error("not implemented jet");
        _private.set(this, {});
    } // Policy#constructor

} // Policy

class Set extends Policy {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
        _private.set(this, {});
    } // Set#constructor

} // Set

class Offer extends Policy {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
        _private.set(this, {});
    } // Offer#constructor

} // Offer

class Agreement extends Policy {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
        _private.set(this, {});
    } // Agreement#constructor

} // Agreement

class ConflictTerm {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _private.set(this, {});
    } // ConflictTerm#constructor

} // ConflictTerm

class Rule {

    constructor(param) {
        _.assert(new.target !== Rule, "Rule is an abstract class.");
        _.assert(param);
        throw new Error("not implemented jet");
        _private.set(this, {});
    } // Rule#constructor

} // Rule

class Permission extends Rule {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
        _private.set(this, {});
    } // Permission#constructor

} // Permission

class Prohibition extends Rule {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
        _private.set(this, {});
    } // Prohibition#constructor

} // Prohibition

class Duty extends Rule {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
        _private.set(this, {});
    } // Duty#constructor

} // Duty

class Constraint {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _private.set(this, {});
    } // Contraint#constructor

} // Contraint

class LogicalConstraint {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _private.set(this, {});
    } // LogicalContraint#constructor

} // LogicalContraint

class Operator {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _private.set(this, {});
    } // Operator#constructor

} // Operator

class LeftOperand {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _private.set(this, {});
    } // LeftOperand#constructor

} // LeftOperand

class RightOperand {

    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        _private.set(this, {});
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
