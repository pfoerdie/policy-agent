/** @module PolicyAgent.decide */

const { util: _ } = package = require("..");
module.exports = package._construct("decide", __dirname);

package.decide._load("findPolicies", "./findPolicies.cyp", package.repo.bindQuery);

package.decide._require("enforcePolicies", "./enforcePolicies.js");