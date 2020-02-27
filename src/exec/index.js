/** @module PolicyAgent.exec */

const { util: _ } = _package = require("..");
module.exports = _package._construct("exec", __dirname);

_package.exec._load("findAction", "./findAction.cyp", _package.repo.bindQuery);
_package.exec._load("mergeAction", "./mergeAction.cyp", _package.repo.bindQuery);
// _package.exec._load("createAction", "./createAction.cyp", _package.repo.bindQuery);

_package.exec._require("Action", "./Action.js");
_package.exec._require("register", "./register.js");
_package.exec._require("define", "./define.js");
_package.exec._require("enforceActions", "./enforceActions.js");
