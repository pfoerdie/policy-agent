/**
 * Policy Agent
 * @module PolicyAgent
 * @author Simon Petrac
 */

const
    PEP = require('./core/PEP.js'),
    PDP = require('./core/PDP.js'),
    PAP = require('./core/PAP.js'),
    PIP = require('./core/PIP.js'),
    RP = require('./core/RP.js'),
    SP = require('./core/SP.js'),
    EP = require('./core/EP.js'),
    PEP_express = require('./module/PEP.express.js'),
    PEP_socketIO = require('./module/PEP.socketIO.js'),
    RP_FileSystem = require('./module/RP.FileSystem.js');

exports['PEP'] = PEP;
exports['PDP'] = PDP;
exports['PAP'] = PAP;
exports['PIP'] = PIP;
exports['RP'] = RP;
exports['SP'] = SP;
exports['EP'] = EP;

exports['PEP']['express'] = PEP_express(PEP);
exports['PEP']['socketIO'] = PEP_socketIO(PEP);
exports['RP']['FileSystem'] = RP_FileSystem(RP);