/**
 * @module PolicyAgent.GenericPEP
 * @author Simon Petrac
 */

const
    V8n = require('v8n'),
    UUID = require('uuid/v4'),
    Crypto = require('crypto'),
    CookieParser = require('cookie-parser'),
    Express = require('express'),
    ExpressSession = require('express-session'),
    SessionMemoryStore = require('session-memory-store')(ExpressSession),
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

        this.data.hashedID = Crypto.createHash('sha256').update(this.id).digest('base64');

        this.data.cookieSecret = UUID();
        this.data.cookieMaxAge = 60 * 60 * 24 * 7;

        this.data.sessionStore = ExpressSession({
            name: this.data.hashedID,
            secret: this.data.cookieSecret,
            cookie: {
                maxAge: this.data.cookieMaxAge,
                secure: true
            },
            store: new SessionMemoryStore({
                expires: this.data.cookieMaxAge
            }),
            saveUninitialized: true, // TODO setze saveUninitialized auf false
            resave: false
        });

    } // GenericPEP#constructor

    /**
     * @name GenericPEP#request
     * @param {Session} session
     * @param {JSON} param
     * @returns {*}
     * @async
     */
    async request(session, param) {
        try {
            // TODO
        } catch (err) {
            this.throw(err);
        }
    } // GenericPEP#request

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


/**
 * @name SocketIoPEP
 * @extends GenericPEP
 */
class SocketIoPEP extends GenericPEP {

} // SocketIoPEP


module.exports = Object.assign(GenericPEP, {
    'express': {
        enumerable: true,
        get: () => ExpressPEP
    },
    'socketIO': {
        enumerable: true,
        get: () => SocketIoPEP
    }
});