/**
 * @module PIP
 * @author Simon Petrac
 */

const
    path = require('path');

const
    _private = new WeakMap();

module.exports = (_package) => {

    class PIP {

        constructor(options) {

            _private.set(this, {});
            _package.set(this, {});

        } // constructor

    } // class PIP

    return PIP;

}; // module.exports