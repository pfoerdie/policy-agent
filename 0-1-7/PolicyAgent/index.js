/**
 * Policy Agent
 * @module PolicyAgent
 * @author Simon Petrac
 */

const
    Path = require('path'),
    core = require(Path.join(__dirname, 'core')),
    mod = require(Path.join(__dirname, 'module'))(core);

exports['PEP'] = core.PEP;
exports['PDP'] = core.PDP;
exports['PAP'] = core.PAP;
exports['PIP'] = core.PIP;

exports['RP'] = core.RP;
exports['SP'] = core.SP;
exports['EP'] = core.EP;

exports['PEP']['express'] = mod.PEP.express;
exports['PEP']['socketIO'] = mod.PEP.socketIO;