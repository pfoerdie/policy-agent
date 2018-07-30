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
            options = options || {};

            _private.set(this, {});
            _package.set(this, {
                type: 'PRP'
            });

        } // constructor

        static isPRP(obj) {
            return obj && _package.has(obj) && _package.get(obj).type === 'PRP';
        } // static isPRP

    } // class PRP

    return PRP;

}; // module.exports