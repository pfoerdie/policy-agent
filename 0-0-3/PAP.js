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
            options = options || {};

            _private.set(this, {
                PRPs: new Set()
            });
            _package.set(this, {
                type: 'PAP'
            });

        } // constructor

        attachPRP(newPRP) {
            if (!PRP.isPRP(newPRP))
                throw new Error(`PAP#attachPRP(newPRP)\nnewPRP has to be a PRP from the same PolicyAgent`);

            _private.get(this).PRPs.add(newPRP);
        } // attachPRP

        static isPAP(obj) {
            return obj && _package.has(obj) && _package.get(obj).type === 'PAP';
        } // static isPAP

    } // class PAP

    return PAP;

}; // module.exports