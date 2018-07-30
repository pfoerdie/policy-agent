/**
 * @module PIP
 * @author Simon Petrac
 */

const
    PIP = {};

/**
 * This object contains all public methods.
 * @name PIP.public
 * @type {Object}
 */
PIP.public = Object.create({}, {

}); // PIP.public

/**
 * @name PIP.hrt
 * @type {number}
 * @public
 */
Object.defineProperty(PIP, 'hrt', {
    enumerable: true,
    get: () => Date.now()
});

module.exports = PIP;