/** 
 * @module PRP
 * @author Simon Petrac
 * 
 * {@link https://www.w3.org/TR/odrl-model/#infoModel ODRL Information Model}
 */

const
    Neo4j = require('neo4j-driver').v1,
    EventEmitter = require('events'),
    _ = require("./tools.js"),
    _module = require("./module.js");

/**
 * @name _driver
 * @type {Neo4j~driver}
 * @private
 */
let _driver = null;

/** 
 * @name PRP.connect
 * @param {string} [hostname="localhost"]
 * @param {string} [username="neo4j"]
 * @param {string} [password="neo4j"]
 * @function
 * @public
 */
_.enumerate(exports, 'connect', function (hostname = "localhost", username = "neo4j", password = "neo4j") {
    _.assert(!_driver, "already connected");
    _.assert(_.is.string(hostname) && _.is.string(username) && _.is.string(password), "invalid arguments");
    _driver = Neo4j.driver("bolt://" + hostname, Neo4j.auth.basic(username, password));
});

_.define(exports, 'wipeData', async function (confirm = false) {
    // TODO temporary - remove after testing
    _.assert(!confirm, "not confirmed");
    _.assert(_driver, "not connected");
    await _requestNeo4j("MATCH (n) DETACH DELETE n");
});

/**
 * @name _uids
 * @type {Mapy<string, ODRL>}
 * @private
 */
const _UIDs = new Map();

/**
 * @name ODRL
 * @extends EventEmitter
 * @class
 * @private
 * @abstract
 */
class ODRL extends EventEmitter {

    /**
     * @constructs ODRL
     * @param {*} param 
     */
    constructor(param) {
        // IDEA as base class for everything
        // _.assert(new.target != ODRL);
        _.assert.object(param);
        super();
        _.define(this, '_param', param);
        if (param.uid && _.is.string(param.uid)) {
            _.assert(!_UIDs.has(param.uid));
            _UIDs.set(param.uid, this);
        }
        _.set(this, '_ts', Date.now());
        _.set(this, '_cleared', false);
    }

    /**
     * @name ODRL#_touch
     * @returns {boolean}
     * @private
     */
    _touch() {
        if (this._cleared) return false;
        _.set(this, '_ts', Date.now());
        return true;
    }

    /**
     * @name ODRL#_clear
     * @param {function} clearedCB
     * @returns {boolean}
     * @private
     */
    _clear(clearedCB) {
        _.assert(!this._cleared);
        let cancel = false;
        this.emit('clear', () => { cancel = true });
        if (cancel) return false; // cancel because clearing was aborted
        if (_.is.function(clearedCB)) clearedCB();
        _UIDs.delete(this._param.uid);
        this.removeAllListeners();
        _.set(this, '_cleared', true);
        this.emit('cleared');
        return true;
    }

    /**
     * @name ODRL#_expire
     * @param {number} [ms=0]
     * @returns {boolean}
     * @private
     */
    _expire(ms = 0) {
        _.assert(!this._cleared);
        _.assert.number(ms);
        let expires = this._ts + ms;
        _.set(this, '_expires', expires); // to know if expire got called another time
        if (ms <= 0) return false;
        let timeout = setTimeout(() => {
            if (this._expires != expires) return; // cancel because expire got called in the meantime
            if (expires > Date.now() || !this._clear(() => this.emit('expired'))) this._expire(ms); // refresh expire if touched in the meantime or clearing was unsuccessful
        }, expires + 1e3 - Date.now()); // add 1 sec for good measure
        this.on('cleared', () => clearTimeout(timeout));
        return true;
    }

}

/**
 * @name PRP.Asset
 * @extends ODRL
 * @class
 */
_.define(exports, 'Asset', class extends ODRL {

    /**
     * @constructs Asset
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name PRP.AssetCollection
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
 * @name PRP.Party
 * @extends ODRL
 * @class
 */
_.define(exports, 'Party', class extends ODRL {

    /**
     * @constructs Party
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name PRP.PartyCollection
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
 * @name PRP.Action
 * @extends ODRL
 * @class
 */
_.define(exports, 'Action', class extends ODRL {

    /**
     * @constructs Action
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name PRP.Policy
 * @extends ODRL
 * @class
 */
_.define(exports, 'Policy', class extends ODRL {

    /**
     * @constructs Policy
     * @param {*} param 
     */
    constructor(param) {
        _.assert(new.target !== Policy, "Policy is an abstract class.");
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    } // Policy#constructor

});

/**
 * @name PRP.Set
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
 * @name PRP.Offer
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
 * @name PRP.Agreement
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
 * @name PRP.ConflictTerm
 * @extends ODRL
 * @class
 */
_.define(exports, 'ConflictTerm', class extends ODRL {

    /**
     * @constructs ConflictTerm
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name PRP.Rule
 * @extends ODRL
 * @class
 */
_.define(exports, 'Rule', class extends ODRL {

    /**
     * @constructs Rule
     * @param {*} param 
     */
    constructor(param) {
        _.assert(new.target !== Rule, "Rule is an abstract class.");
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name PRP.Permission
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
 * @name PRP.Prohibition
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
 * @name PRP.Duty
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
 * @name PRP.Contraint
 * @extends ODRL
 * @class
 */
_.define(exports, 'Contraint', class extends ODRL {

    /**
     * @constructs Contraint
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name PRP.LogicalContraint
 * @extends ODRL
 * @class
 */
_.define(exports, 'LogicalContraint', class extends ODRL {

    /**
     * @constructs LogicalContraint
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name PRP.Operator
 * @extends ODRL
 * @class
 */
_.define(exports, 'Operator', class extends ODRL {

    /**
     * @constructs Operator
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name PRP.LeftOperand
 * @class
 */
_.define(exports, 'LeftOperand', class extends ODRL {

    /**
     * @constructs LeftOperand
 * @extends ODRL
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @name PRP.RightOperand
 * @extends ODRL
 * @class
 */
_.define(exports, 'RightOperand', class extends ODRL {

    /**
     * @constructs RightOperand
     * @param {*} param 
     */
    constructor(param) {
        _.assert(param);
        throw new Error("not implemented jet");
        super(param);
    }

});

/**
 * @function _requestNeo4j
 * @param {string|string[]} query 
 * @param {Object} [param=null]
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
 * @name Record
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