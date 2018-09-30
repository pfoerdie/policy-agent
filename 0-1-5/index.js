const
    PolicyPoint = require('./core/PolicyPoint.js'),
    Context = require('./core/Context.js'),
    PEP = require('./core/PEP.js'),
    PDP = require('./core/PDP.js'),
    PIP = require('./core/PIP.js'),
    PAP = require('./core/PAP.js'),
    SubjectsPoint = require('./core/SubjectsPoint.js'),
    ResourcePoint = require('./core/ResourcePoint.js');

require('./module/ExpressPEP.js');
require('./module/SocketIoPEP.js');

exports['PEP'] = PEP;
exports['PDP'] = PDP;
exports['PIP'] = PIP;
exports['PAP'] = PAP;
exports['SP'] = SubjectsPoint;
exports['RP'] = ResourcePoint;

Object.freeze(module.exports);