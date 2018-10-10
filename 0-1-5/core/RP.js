/**
 * Resource Point
 * @module PolicyAgent.RP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Fs = require('fs'),
    PolicyPoint = require('./PolicyPoint.js'),
    _promify = (callback, ...args) => new Promise((resolve, reject) => callback(...args, (err, result) => err ? reject(err) : resolve(result)));

/**
 * @name RP
 * @extends PolicyAgent.PolicyPoint
 */
class RP extends PolicyPoint {
    /**
     * @constructs RP
     * @param {JSON} [options={}]
     * @abstract
     * @public
     */
    constructor(options = {}) {
        super(options);

        if (typeof options['root'] !== 'string')
            this.throw('constructor', new TypeError(`invalid param`));

        this.data.root = options['root'];

    } // RP.constructor

    async _retrieve() {

        // TODO

    } // RP#_retrieve

    async _submit() {

        // TODO

    } // RP#_submit

} // RP

module.exports = RP;