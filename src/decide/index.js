/**
 * @module PolicyAgent.decide
 * @author Simon Petrac
 */

const { util: _ } = package = require("..");
module.exports = package._construct("decide", __dirname);

package.decide._require("enforce", "./enforce.js");