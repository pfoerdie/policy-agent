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

class Resource {
    // TODO
} // Resource

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
            this.throw('constructor', new TypeError(`invalid options`));

        this.data.root = options['root'];

    } // RP.constructor

    /**
     * 
     * @param {(object|object[])} resourceID 
     */
    async _retrieve(query) {
        const
            queryArr = Array.isArray(query) ? query : undefined;

        if (queryArr ? queryArr.some(query => !query || typeof query['@type'] !== 'string') : !query || typeof query['@type'] !== 'string')
            this.throw('_retrieve', new TypeError(`invalid argument`));

        const _retrieve = (query) => new Promise((resolve, reject) => {
            switch (query['@type']) {

                case 'File':
                    let filePath = Path.join(this.data.root, query['path'].replace(/^(?:\.|\/|\\)*/, ""));
                    Fs.readFile(filePath, (err, data) => err ? resolve(undefined) : resolve(data));
                    break;

                default:
                    resolve(undefined);

            } // switch
        });

        let result = queryArr
            ? await Promise.all(queryArr.map(query => _retrieve(query)))
            : await _retrieve(query);

        return result;

    } // RP#_retrieve

    async _submit(query) {
        const
            queryArr = Array.isArray(query) ? query : undefined;

        if (queryArr ? queryArr.some(query => typeof query !== 'object') : typeof query !== 'object')
            this.throw('_retrieve', new TypeError(`invalid argument`));

        const _retrieve = (query) => new Promise((resolve, reject) => {
            switch (query['type']) {

                case 'File':
                    let
                        filePath = Path.join(this.data.root, query['path'].replace(/^(?:\.|\/|\\)*/, "")),
                        data = query['@value'];
                    if (data)
                        Fs.writeFile(filePath, data, (err) => err ? resolve(false) : resolve(true));
                    else
                        resolve(false);
                    break;

                default:
                    resolve(false);

            } // switch
        });

        return queryArr
            ? await Promise.all(queryArr.map(query => _retrieve(query)))
            : await _retrieve(query);

    } // RP#_submit

} // RP

module.exports = RP;