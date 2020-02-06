/**
 * @module PolicyAgent
 * @author Simon Petrac
 */

const _ = require("./tools.js");

_.define(exports, "id", "PolicyAgent");

/**
 * @name enforce
 * @type {function}
 * @public
 */
_.define(exports, "enforce", require("./enforce.js"));

/**
 * @name exec
 * @type {object}
 * @public
 */
_.define(exports, "exec", require("./exec.js"));

/**
 * @name decide
 * @type {function}
 * @private
 */
_.define(exports, "decide", require("./decide.js"));

/**
 * @name info
 * @type {object}
 * @public
 */
_.define(exports, "info", require("./info.js"));

/**
 * @name repo
 * @type {object}
 * @public
 */
_.define(exports, "repo", require("./repo.js"));

/**
 * @name admin
 * @type {object}
 * @public
 */
_.define(exports, "admin", require("./admin.js"));