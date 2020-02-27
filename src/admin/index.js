/** @module PolicyAgent.admin */

const { util: _ } = _package = require("..");
module.exports = _package._construct("admin", __dirname);

_package.admin._load("setupNodes", "./setupNodes.cyp", _package.repo.bindQuery);
_package.admin._load("setupConstraints", "./setupConstraints.cyp", _package.repo.bindQuery);
_package.admin._load("findPolicies", "./findPolicies.cyp", _package.repo.bindQuery);

_package.admin._require("Constraint", "./Constraint.js");
_package.admin._require("Rule", "./Rule.js");
_package.admin._require("Policy", "./Policy.js");

_package.admin._require("setup", "./setup.js");
_package.admin._require("login", "./login.js");
_package.admin._require("audit", "./audit.js");
_package.admin._require("enforcePolicies", "./enforcePolicies.js");