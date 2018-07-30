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
            options = options || {};

            _private.set(this, {
                PDPs: new Set()
            });
            _package.set(this, {
                type: 'PEP'
            });

        } // constructor

        attachPDP(newPDP) {
            if (!PDP.isPDP(newPDP))
                throw new Error(`PEP#attachPDP(newPDP)\nnewPDP has to be a PDP from the same PolicyAgent`);

            _private.get(this).PDPs.add(newPDP);
        } // attachPDP

        static isPEP(obj) {
            return obj && _package.has(obj) && _package.get(obj).type === 'PEP';
        } // static isPEP

    } // class PEP

    return PEP;

}; // module.exports