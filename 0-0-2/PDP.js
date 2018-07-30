/**
 * @module PDP
 * @author Simon Petrac
 */

const
    path = require('path');

const
    PIP_ = require(path.join(__dirname, 'PIP.js')),
    PRP_ = require(path.join(__dirname, 'PRP.js')),
    _private = new WeakMap();

module.exports = (_package) => {

    const
        PIP = PIP_(_package),
        PRP = PRP_(_package);

    class PDP {

        constructor(options) {

            _private.set(this, {});
            _package.set(this, {});

        } // constructor

    } // class PDP

    return PDP;

}; // module.exports