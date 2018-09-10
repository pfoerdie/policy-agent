/**
 * @module PolicyAgent.GenericPEP
 * @author Simon Petrac
 */

const
    V8n = require('v8n'),
    PolicyPoint = require('./PolicyPoint.js'),
    Context = require('./Context.js');

/**
 * @name GenericPEP
 * @extends PolicyPoint
 */
class GenericPEP extends PolicyPoint {
    /**
     * @constructs GenericPEP
     * @param {JSON} [options={}]
     * @abstract
     * @public
     */
    constructor(options = {}) {
        if (!new.target || new.target === GenericPEP)
            throw new Error(`GenericPEP is an abstract class`);

        super(options['@id']);

        this.data.sessionStore = null; // TODO

    } // GenericPEP#constructor

    /**
     * TODO
     */
    async request() {

    } // GenericPEP#request

    /**
     * TODO
     */
    static getComponent(instanceID) {
        return super(instanceID);
    } // GenericPEP.getComponent

    static get express() {
        return ExpressPEP;
    } // GenericPEP.express<getter>

} // GenericPEP

/**
 * @name ExpressPEP
 * @extends GenericPEP
 */
class ExpressPEP extends GenericPEP {
    /**
     * @constructs ExpressPEP
     * @param {JSON} [options={}]
     * @public
     */
    constructor(options) {
        super(options);

    } // ExpressPEP#constructor

    /**
     * @name ExpressPEP#router
     * @param {object} request
     * @param {object} response
     * @param {function} next
     * @async
     */
    async router(request, response, next) {
        // TODO
    } // ExpressPEP#router<getter>

} // ExpressPEP

module.exports = GenericPEP;