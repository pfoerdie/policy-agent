/**
 * @module PAP
 * @author Simon Petrac
 */

const
    path = require('path');

const
    PRP_ = require(path.join(__dirname, 'PRP.js')),
    _private = new WeakMap();

module.exports = (_package) => {

    const
        PRP = PRP_(_package);

    class PAP {

        constructor(options) {

            _private.set(this, {});
            _package.set(this, {});

        } // constructor

    } // class PAP

    return PAP;

}; // module.exports