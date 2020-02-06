/**
 * @module PolicyAgent
 * @author Simon Petrac
 */

const _ = require("./tools.js");
const _module = new (function PolicyAgent() { });
module.exports = _module;

/**
 * @name enforce
 * @type {function}
 */
_.enumerate(_module, "enforce", require("./enforce.js"));

/**
 * @name exec
 * @type {*}
 */
_.enumerate(_module, "exec", require("./exec.js"));

/**
 * @name decide
 * @type {*}
 */
_.enumerate(_module, "decide", require("./decide.js"));

/**
 * @name info
 * @type {*}
 */
_.enumerate(_module, "info", require("./info.js"));

/**
 * @name repo
 * @type {*}
 */
_.enumerate(_module, "repo", require("./repo.js"));

/**
 * @name admin
 * @type {*}
 */
_.enumerate(_module, "admin", require("./admin.js"));