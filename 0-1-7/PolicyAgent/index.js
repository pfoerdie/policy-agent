/**
 * Policy Agent
 * @module PolicyAgent
 * @author Simon Petrac
 */

const
    Path = require('path'),
    core = require(Path.join(__dirname, 'core')),
    modl = require(Path.join(__dirname, 'module'));

exports['PEP'] = core.PEP;
exports['PDP'] = core.PDP;
exports['PAP'] = core.PAP;
exports['PIP'] = core.PIP;

exports['RP'] = core.RP;
exports['SP'] = core.SP;
exports['EP'] = core.EP;

exports['PEP']['express'] = modl.PEP.express;