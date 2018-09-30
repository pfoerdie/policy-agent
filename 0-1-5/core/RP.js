/**
 * Resource Point
 * @module PolicyAgent.RP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    Path = require('path'),
    Fs = require('fs'),
    PolicyPoint = require('./PolicyPoint.js');

/**
 * @name RP
 * @extends PolicyPoint
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

    // TODO

} // RP

module.exports = RP;