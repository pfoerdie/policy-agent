/**
 * @module PolicyAgent.repo
 * @author Simon Petrac
 */

const { tools: _ } = _package = require("..");
module.exports = _package.construct("repo", __dirname);
_package.private.set(_package.repo, { driver: null });

_package.repo.define("id", "PolicyAgent.repo");
_package.repo.add("connect", "./connect.js");
_package.repo.define("connect.id", "PolicyAgent.repo.connect");
_package.repo.add("disconnect", "./disconnect.js");
_package.repo.define("disconnect.id", "PolicyAgent.repo.disconnect");
_package.repo.add("ping", "./ping.js");
_package.repo.define("ping.id", "PolicyAgent.repo.ping");
_package.repo.add("query", "./query.js");
_package.repo.define("query.id", "PolicyAgent.repo.query");