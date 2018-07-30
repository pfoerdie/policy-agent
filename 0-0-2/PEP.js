/**
 * @module PEP
 * @author Simon Petrac
 */

const
    path = require('path');

const
    PDP_ = require(path.join(__dirname, 'PDP.js')),
    _private = new WeakMap();

module.exports = (_package) => {

    const
        PDP = PDP_(_package);

    class PEP {

        constructor(options) {

            _private.set(this, {});
            _package.set(this, {});

        } // constructor

    } // class PEP

    return PEP;

}; // module.exports