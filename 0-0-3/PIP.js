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
            options = options || {};

            _private.set(this, {});
            _package.set(this, {
                type: 'PIP'
            });

        } // constructor

        static isPIP(obj) {
            return obj && _package.has(obj) && _package.get(obj).type === 'PIP';
        } // static isPIP

    } // class PIP

    return PIP;

}; // module.exports