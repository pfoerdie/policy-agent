/**
 * @module PolicyAgent.repo
 * @author Simon Petrac
 */

const { util: _ } = _package = require("..");
module.exports = _package._construct("repo", __dirname);

_package.repo._require("connect", "./connect.js");
_package.repo._require("disconnect", "./disconnect.js");
_package.repo._require("ping", "./ping.js");
_package.repo._require("query", "./query.js");