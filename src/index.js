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
_.enumerate(exports, "enforce", require("./enforce"));

/**
 * @name exec
 * @type {object}
 * @public
 */
_.enumerate(exports, "exec", require("./exec"));

/**
 * @name decide
 * @type {function}
 * @private
 */
_.enumerate(exports, "decide", require("./decide"));

/**
 * @name info
 * @type {object}
 * @public
 */
_.enumerate(exports, "info", require("./info"));

/**
 * @name repo
 * @type {object}
 * @public
 */
_.enumerate(exports, "repo", require("./repo"));

/**
 * @name admin
 * @type {object}
 * @public
 */
_.enumerate(exports, "admin", require("./admin"));