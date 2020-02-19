/** @module PolicyAgent.decide */

const { util: _ } = package = require("..");
module.exports = package._construct("decide", __dirname);

package.decide._require("enforce", "./enforce.js");