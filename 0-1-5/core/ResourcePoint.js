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

//#region ResourcePoint

/**
 * @name ResourcePoint
 * @extends PolicyPoint
 */
class ResourcePoint extends PolicyPoint {
    /**
     * @constructs ResourcePoint
     * @param {JSON} [options={}]
     * @abstract
     * @public
     */
    constructor(options = {}) {
        super(options);

        if (typeof options['root'] !== 'string')
            this.throw('constructor', new TypeError(`invalid param`));

        this.data.root = options['root'];

    } // ResourcePoint.constructor

    // TODO

} // ResourcePoint

//#endregion ResourcePoint

module.exports = ResourcePoint;