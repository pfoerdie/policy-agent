/**
 * Policy Agent - Core
 * @module PolicyAgent
 * @author Simon Petrac
 */

const
    PolicyPoint = require('./PolicyPoint.js'),
    Context = require('./Context.js'),
    PEP = require('./PEP.js'),
    PDP = require('./PDP.js'),
    PIP = require('./PIP.js'),
    PAP = require('./PAP.js'),
    SP = require('./SP.js'),
    RP = require('./RP.js');

exports['PEP'] = PEP;
exports['PDP'] = PDP;
exports['PIP'] = PIP;
exports['PAP'] = PAP;
exports['SP'] = SP;
exports['RP'] = RP;

Object.freeze(module.exports);