/**
 * @module PolicyAgent
 * @author Simon Petrac
 */

const
    path_ = require('path'),
    Utility = require(path_.join(__dirname, "Utility.js")),
    PEP = require(path_.join(__dirname, "PEP.js"));

exports.PEP = Utility.buildPublicClass(PEP);