/**
 * @module PolicyAgent
 * @author Simon Petrac
 */

const
    PEP = require('./PEP.js'),
    PDP = require('./PDP.js'),
    PIP = require('./PIP.js'),
    PRP = require('./PRP.js'),
    PAP = require('./PAP.js');

/**
 * @name PolicyAgent.PEP
 */
exports['PEP'] = PEP.public;

/**
 * @name PolicyAgent.PDP
 */
exports['PDP'] = PDP.public;

/**
 * @name PolicyAgent.PIP
 */
exports['PIP'] = PIP.public;

/**
 * @name PolicyAgent.PRP
 */
exports['PRP'] = PRP.public;

/**
 * @name PolicyAgent.PAP
 */
exports['PAP'] = PAP.public;