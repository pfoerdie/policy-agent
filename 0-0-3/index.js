/**
 * @module PolicyAgent
 * @author Simon Petrac
 * 
 * NOTE really really nice :)
 * NOTE das Instanzen-System ist echt geil, dadurch ist das Modul auf jeden Fall ziemlich gut skalierbar
 * NOTE vom Sicherheits-Aspekt ist das Vorgehen mit _private und _package sehr gut geeignet
 */

const
    path = require('path'),
    PEP_ = require(path.join(__dirname, 'PEP.js')),
    PDP_ = require(path.join(__dirname, 'PDP.js')),
    PIP_ = require(path.join(__dirname, 'PIP.js')),
    PRP_ = require(path.join(__dirname, 'PRP.js')),
    PAP_ = require(path.join(__dirname, 'PAP.js'));

const _private = new WeakMap();

class PolicyAgent {

    constructor(options) {

        const _package = new WeakMap();
        _package.set(this, {
            type: 'PolicyAgent'
        });

        _private.set(this, {
            package: _package
        });

    } // constructor

    get PEP() {
        return PEP_(_private.get(this).package);
    }

    get PDP() {
        return PDP_(_private.get(this).package);
    }

    get PIP() {
        return PIP_(_private.get(this).package);
    }

    get PRP() {
        return PRP_(_private.get(this).package);
    }

    get PAP() {
        return PAP_(_private.get(this).package);
    }

} // class PolicyAgent

module.exports = PolicyAgent;