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
            options = options || {};

            if (!PIP.isPIP(options.PIP))
                throw new Error(`PDP#constructor(options)\noptions.PIP has to be a PIP from the same PolicyAgent`);
            if (!PRP.isPRP(options.PRP))
                throw new Error(`PDP#constructor(options)\noptions.PRP has to be a PRP from the same PolicyAgent`);

            _private.set(this, {
                PIP: options.PIP,
                PRP: options.PRP
            });
            _package.set(this, {
                type: 'PDP'
            });

        } // constructor

        static isPDP(obj) {
            return obj && _package.has(obj) && _package.get(obj).type === 'PDP';
        } // static isPDP

    } // class PDP

    return PDP;

}; // module.exports