/**
 * Resource Point
 * @module PolicyAgent.RP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    Path = require('path'),
    Fs = require('fs'),
    PolicyPoint = require('./PolicyPoint.js'),
    _promify = (callback, ...args) => new Promise((resolve, reject) => callback(...args, (err, result) => err ? reject(err) : resolve(result)));

class Resource {
    /**
     * IDEA
     * Resource#load zum laden der Resource.
     * Kann zB vom PIP instanziiert werden und später in der Action geladen
     */
} // Resource

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

    async _retrieve() {

    } // RP#_retrieve

    async _submit() {

    } // RP#_submit

    // TODO

} // RP

module.exports = RP;