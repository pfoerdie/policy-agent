/**
 * Environment Point
 * @module PolicyAgent.EP
 * @author Simon Petrac
 */

const
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
     * @param {string} [options.host="localhost"]
     * @param {number} [options.port=27017]
     * @abstract
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.topics = [];
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

    _retrieve(topic, ...args) {
        if (typeof topic !== 'string')
            this.throw('_retrieve', new TypeError(`invalid argument`));
        if (!this.data.topics.includes(topic))
            this.throw('_retrieve', new Error(`topic not supported`));
    } // EP#_retrieve

} // EP

module.exports = EP;