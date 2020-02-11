/**
 * @module PolicyAgent
 * @author Simon Petrac
 */

const _ = require("./tools");

_.define(exports, "id", "PolicyAgent");
_.define(exports, "private", new WeakMap());

_.enumerate(exports, "enforce", require("./enforce/enforce.js"));
_.enumerate(exports, "exec", require("./exec/exec.js"));
_.enumerate(exports, "decide", require("./decide/decide.js"));
_.enumerate(exports, "info", require("./info/info.js"));
_.enumerate(exports, "repo", require("./repo/repo.js"));
_.enumerate(exports, "admin", require("./admin/admin.js"));

_.log(exports);