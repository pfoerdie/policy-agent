const
    Path = require('path'),
    load = (mod) => require(Path.join(__dirname, mod + ".js"));

exports.PEP = load('PEP');
exports.PDP = load('PDP');
exports.PIP = load('PIP');
exports.PAP = load('PAP');
exports.PP = load('PolicyPoint');
exports.audit = load('Auditor');