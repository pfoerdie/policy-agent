/**
 * @module PolicyAgent.info
 * @author Simon Petrac
 */

const { tools: _ } = _package = require("..");
module.exports = _package.construct("info", __dirname);
_package.private.set(_package.info, {});

_package.info.define("id", "PolicyAgent.info");