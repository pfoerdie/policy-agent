/**
 * Policy Agent
 * @module PolicyAgent
 * @author Simon Petrac
 */

const // core
    PEP = require('./PEP.js'),
    PDP = require('./PDP.js'),
    PIP = require('./PIP.js'),
    PAP = require('./PAP.js');

const // modules
    expressPEP = require('./PEP.express.js'),
    socketIOPEP = require('./PEP.socketIO.js'),
    FilePIP = require('./PIP.File.js');

// NOTE use publicClassBuilder here

exports['PEP'] = PEP;
exports['PDP'] = PDP;
exports['PAP'] = PAP;
exports['PIP'] = PIP;

exports['PEP']['express'] = expressPEP;
exports['PEP']['socketIO'] = socketIOPEP;
exports['PIP']['File'] = FilePIP;