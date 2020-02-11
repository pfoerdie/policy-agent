/**
 * @module PolicyAgent
 * @author Simon Petrac
 */

const _ = require("./tools");

const Package = require("./Package");
const _package = new Package(__dirname);
module.exports = _package;

_package.define("id", "PolicyAgent");
_package.define("private", new WeakMap());
_package.define("tools", _);

// _package.add("tools", "./tools.js");
// _package.add("enforce", "./enforce/enforce.js");
// _package.add("exec", "./exec/exec.js");
// _package.add("decide", "./decide/decide.js");
// _package.add("info", "./info/info.js");
// _package.add("repo", "./repo/repo.js");
// _package.add("admin", "./admin/admin.js");

_package.add("enforce", "./enforce/index.js");
_package.add("exec", "./exec/index.js");
_package.add("decide", "./decide/index.js");
_package.add("info", "./info/index.js");
_package.add("repo", "./repo/index.js");
_package.add("admin", "./admin/index.js");

_.log(_package);

// _.define(exports, "id", "PolicyAgent");
// _.define(exports, "private", new WeakMap());

// _.enumerate(exports, "enforce", require("./enforce/enforce.js"));
// _.enumerate(exports, "exec", require("./exec/exec.js"));
// _.enumerate(exports, "decide", require("./decide/decide.js"));
// _.enumerate(exports, "info", require("./info/info.js"));
// _.enumerate(exports, "repo", require("./repo/repo.js"));
// _.enumerate(exports, "admin", require("./admin/admin.js"));

// _.log(exports);