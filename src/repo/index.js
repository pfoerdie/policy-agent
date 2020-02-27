/** @module PolicyAgent.repo */

const { util: _ } = _package = require("..");
module.exports = _package._construct("repo", __dirname);

_package.repo._require("Record", "./Record.js");
_package.repo._require("connect", "./connect.js");
// _package.repo._require("disconnect", "./disconnect.js"); // TODO rethink about removing this for security reasons and no real purpose
_package.repo._require("ping", "./ping.js");
_package.repo._require("query", "./query.js");
_package.repo._require("bindQuery", "./bindQuery.js");