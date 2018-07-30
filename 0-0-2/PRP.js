/**
 * @module PRP
 * @author Simon Petrac
 */

const
    path = require('path');

const
    _private = new WeakMap();

module.exports = (_package) => {

    class PRP {

        constructor(options) {

            _private.set(this, {});
            _package.set(this, {});

        } // constructor

    } // class PRP

    return PRP;

}; // module.exports