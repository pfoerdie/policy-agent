/**
 * @module PolicyAgent
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    DataStore = require(Path.join(__dirname, "DataStore.js")),
    // Context = require(Path.join(__dirname, "Context.js")),
    PEP = require(Path.join(__dirname, "PEP.js")),
    PDP = require(Path.join(__dirname, "PDP.js")),
    PIP = require(Path.join(__dirname, "PIP.js")),
    PAP = require(Path.join(__dirname, "PAP.js")),
    PXP = require(Path.join(__dirname, "PXP.js"));

exports.PEP = Utility.getPublicClass(PEP);
exports.PDP = Utility.getPublicClass(PDP);
exports.PIP = Utility.getPublicClass(PIP);
exports.PAP = Utility.getPublicClass(PAP);
exports.PXP = Utility.getPublicClass(PXP);

exports.DataStore = {};
for (let [className, privateClass] of Object.entries(DataStore)) {
    exports.DataStore[className] = Utility.getPublicClass(privateClass);
}