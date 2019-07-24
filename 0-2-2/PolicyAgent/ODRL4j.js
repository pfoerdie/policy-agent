/** 
 * {@link https://www.w3.org/TR/odrl-model/#infoModel ODRL Information Model}
 * @module ODRL4j
 * @author Simon Petrac
 */

const
    Neo4j = require('neo4j-driver').v1,
    _ = require("./tools.js");

/**
 * @type {Neo4j~driver}
 * @private
 */
let _driver = null;

/** 
 * @function connect
 * @param {string} [hostname="localhost"]
 * @param {string} [username="neo4j"]
 * @param {string} [password="neo4j"]
 * @public
 */
_.enumerate(exports, 'connect', function (hostname = "localhost", username = "neo4j", password = "neo4j") {
    _.assert(!_driver, "already connected");
    _.assert(_.is.string(hostname) && _.is.string(username) && _.is.string(password), "invalid arguments");
    _driver = Neo4j.driver("bolt://" + hostname, Neo4j.auth.basic(username, password));
});

/**
 * @param {Neo4j~Record} record 
 * @constructor
 * @private
 */
function Record(record) {
    _.assert(new.target === Record, "Record is a constructor");
    for (let key of record['keys']) {
        _.enumerate(this, key, record['_fields'][record['_fieldLookup'][key]]);
    }
}

/**
 * @param {string|string[]} query 
 * @param {object} [param=null]
 * @private
 */
async function _requestNeo4j(query, param = null) {
    _.assert(_driver, "not connected");

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
}

/**
 * @name Asset
 * @class
 */
_.define(exports, 'Asset', class {

    /**
     * @constructs Asset
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    }

});

/**
 * @name AssetCollection
 * @extends Asset
 * @class
 */
_.define(exports, 'AssetCollection', class extends exports.Asset {

    /**
     * @constructs AssetCollection
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name Party
 * @class
 */
_.define(exports, 'Party', class {

    /**
     * @constructs Party
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    }

});

/**
 * @name PartyCollection
 * @extends Party
 * @class
 */
_.define(exports, 'PartyCollection', class extends exports.Party {

    /**
     * @constructs PartyCollection
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name Action
 * @class
 */
_.define(exports, 'Action', class {

    /**
     * @constructs Action
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    }

});

/**
 * @name Policy
 * @class
 */
_.define(exports, 'Policy', class {

    /**
     * @constructs Policy
     * @param {*} param 
     */
    constructor(param) {
        _.assert(new.target !== Policy, "Policy is an abstract class.");
        _.assert(param);
        throw new Error("not implemented jet");
    } // Policy#constructor

});

/**
 * @name Set
 * @extends Policy
 * @class
 */
_.define(exports, 'Set', class extends exports.Policy {

    /**
     * @constructs Set
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name Offer
 * @extends Policy
 * @class
 */
_.define(exports, 'Offer', class extends exports.Policy {

    /**
     * @constructs Offer
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name Agreement
 * @extends Policy
 * @class
 */
_.define(exports, 'Agreement', class extends exports.Policy {

    /**
     * @constructs Agreement
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name ConflictTerm
 * @class
 */
_.define(exports, 'ConflictTerm', class {

    /**
     * @constructs ConflictTerm
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    }

});

/**
 * @name Rule
 * @class
 */
_.define(exports, 'Rule', class {

    /**
     * @constructs Rule
     * @param {*} param 
     */
    constructor(param) {
        _.assert(new.target !== Rule, "Rule is an abstract class.");
        _.assert(param);
        throw new Error("not implemented jet");
    }

});

/**
 * @name Permission
 * @extends Rule
 * @class
 */
_.define(exports, 'Permission', class extends exports.Rule {

    /**
     * @constructs Permission
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name Prohibition
 * @extends Rule
 * @class
 */
_.define(exports, 'Prohibition', class extends exports.Rule {

    /**
     * @constructs Prohibition
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name Duty
 * @extends Rule
 * @class
 */
_.define(exports, 'Duty', class extends exports.Rule {

    /**
     * @constructs Duty
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name Contraint
 * @class
 */
_.define(exports, 'Contraint', class {

    /**
     * @constructs Contraint
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    }

});

/**
 * @name LogicalContraint
 * @class
 */
_.define(exports, 'LogicalContraint', class {

    /**
     * @constructs LogicalContraint
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    }

});

/**
 * @name Operator
 * @class
 */
_.define(exports, 'Operator', class {

    /**
     * @constructs Operator
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    }

});

/**
 * @name LeftOperand
 * @class
 */
_.define(exports, 'LeftOperand', class {

    /**
     * @constructs LeftOperand
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    }

});

/**
 * @name RightOperand
 * @class
 */
_.define(exports, 'RightOperand', class {

    /**
     * @constructs RightOperand
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
    }

});
