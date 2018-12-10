/**
 * Environment Point
 * @module PolicyAgent.EP
 * @author Simon Petrac
 */

const
    Fs = require('fs'),
    PolicyPoint = require('./PolicyPoint.js');

/**
 * @name _timeoutPromise
 * @param {Promise} origPromise 
 * @param {number} toTime 
 * @private
 * @async
 */
async function _timeoutPromise(origPromise, duration) {
    if (duration === Infinity || duration < 0)
        return await origPromise;

    let timeout, toPromise = new Promise((resolve, reject) => {
        timeout = setTimeout(() => reject(new Error(`timed out`)), duration);
    });

    await Promise.race([origPromise, toPromise]);
    clearTimeout(timeout);
    return await origPromise;
} // _timeoutPromise

/**
 * @name EP
 * @extends PolicyAgent.PolicyPoint
 */
class EP extends PolicyPoint {
    /**
     * @constructs EP
     * @param {JSON} [options={}]
     * @abstract
     * @public
     */
    constructor(options = {}) {
        super(options);
    } // EP.constructor

    /**
     * @name EP#ping
     * @async
     */
    async ping() {
        try {
            this.log('ping', "success");
            return undefined;
        } catch (err) {
            this.throw('ping', err);
        }
    } // EP#ping

    /**
     * @name EP#_find
     * @param {*} target 
     * @interface
     */
    async _find(target) {

        // TODO
        this.log('_find', "" + target);

    } // EP#_find

} // EP

module.exports = EP;