const
    Path = require('path'),
    load = (mod) => require(Path.join(__dirname, mod + ".js"));

exports.audit = load('Auditor');
exports.PP = load('PolicyPoint');

exports.PEP = load('PEP');
exports.PDP = load('PDP');
exports.PIP = load('PIP');
exports.PAP = load('PAP');

exports.SP = load('SP');
exports.RP = load('RP');
exports.EP = load('EP');