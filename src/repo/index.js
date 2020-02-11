/**
 * @module PolicyAgent.repo
 * @author Simon Petrac
 */

const { tools: _ } = _package = require("..");
module.exports = _package.construct("repo", __dirname);

_package.repo.require("connect", "./connect.js");
_package.repo.require("disconnect", "./disconnect.js");
_package.repo.require("ping", "./ping.js");
_package.repo.require("query", "./query.js");