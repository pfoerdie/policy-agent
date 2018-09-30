const
    PolicyPoint = require('./core/PolicyPoint.js'),
    Context = require('./core/Context.js'),
    PEP = require('./core/PEP.js'),
    PDP = require('./core/PDP.js'),
    PIP = require('./core/PIP.js'),
    PAP = require('./core/PAP.js'),
    SP = require('./core/SP.js'),
    RP = require('./core/RP.js');

require('./module/ExpressPEP.js');
require('./module/SocketIoPEP.js');

exports['PEP'] = PEP;
exports['PDP'] = PDP;
exports['PIP'] = PIP;
exports['PAP'] = PAP;
exports['SP'] = SP;
exports['RP'] = RP;

Object.freeze(module.exports);