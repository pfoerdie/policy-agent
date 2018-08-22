/**
 * @module PolicyAgent
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    Context = require(Path.join(__dirname, "Context.js")),
    DataStore = require(Path.join(__dirname, "DataStore.js")),
    PIP = require(Path.join(__dirname, "PIP.js")),
    PDP = require(Path.join(__dirname, "PDP.js")),
    PEP = require(Path.join(__dirname, "PEP.js")),
    PAP = require(Path.join(__dirname, "PAP.js"));

/**
 * TODO public Klassen bauen und exportieren
 */
exports['PIP'] = PIP;
exports['PDP'] = PDP;
exports['PEP'] = PEP;
exports['PAP'] = PAP;
exports['DataStore'] = DataStore;



