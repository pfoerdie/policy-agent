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
    _PEP = require(path.join(__dirname, 'PEP.js')),
    _PDP = require(path.join(__dirname, 'PDP.js')),
    _PIP = require(path.join(__dirname, 'PIP.js')),
    _PRP = require(path.join(__dirname, 'PRP.js')),
    _PAP = require(path.join(__dirname, 'PAP.js'));

const _private = new WeakMap();

class PolicyAgent {

    constructor(options) {

        const _package = new WeakMap();
        _package.set(this, {});

        _private.set(this, {
            package: _package
        });

    } // constructor

    get PEP() {
        return _PEP(_private.get(this).package);
    }

    get PDP() {
        return _PDP(_private.get(this).package);
    }

    get PIP() {
        return _PIP(_private.get(this).package);
    }

    get PRP() {
        return _PRP(_private.get(this).package);
    }

    get PAP() {
        return _PAP(_private.get(this).package);
    }

} // class PolicyAgent

module.exports = PolicyAgent;