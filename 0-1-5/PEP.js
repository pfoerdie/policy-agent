/**
 * @module PolicyAgent.GenericPEP
 * @author Simon Petrac
 */

const
    V8n = require('v8n'),
    UUID = require('uuid/v4'),
    CookieParser = require('cookie-parser'),
    Express = require('express'),
    ExpressSession = require('express-session'),
    SessionMemoryStore = require('session-memory-store')(ExpressSession),
    PolicyPoint = require('./PolicyPoint.js'),
    Context = require('./Context.js');

//#region GenericPEP

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

        this.data.sessionMaxAge = 60 * 60 * 24 * 7;

        this.data.sessionStore = new SessionMemoryStore({
            expires: this.data.sessionMaxAge
        });

        return;

    } // GenericPEP#constructor

    /**
     * @name GenericPEP#request
     * @param {Session} session
     * @param {JSON} param
     * @returns {*}
     * @async
     */
    async request(session, subject) {
        if (V8n().not.arrSchema([
            V8n().object(),
            V8n().object() // TODO
        ]).test(arguments)) {
            this.throw('request', new TypeError(`invalid arguments`));
        } // argument validation

        try {
            await new Promise((resolve, reject) => {
                this.data.sessionStore.get(session.id, (err, result) => {
                    if (err)
                        reject(err);
                    else if (result !== session)
                        reject(new Error(`invalid session`));
                    else
                        resolve();
                });
            });

            let context = new Context(session, subject);

            // TODO
        } catch (err) {
            this.throw('request', err);
        }
    } // GenericPEP#request

} // GenericPEP

//#endregion GenericPEP

//#region ExpressPEP

/**
 * @name ExpressPEP~requestRouter
 * @param {object} request
 * @param {object} response
 * @param {function} next
 * @this {ExpressPEP}
 * @async
 * @private
 */
async function requestRouter(request, response, next) {
    try {
        let subject = {
            action: 'use',
            relation: {
                target: {
                    '@type': "html",
                    '@id': "test"
                }
            },
            function: {
                assigner: null,
                assignee: null
            }
        };

        let result = await this.request(request.session, subject);
    } catch (err) {
        // TODO ??
        next();
    }
} // ExpressPEP~requestRouter

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

        this.data.cookieSecret = UUID();
        this.data.cookieMaxAge = 60 * 60 * 24 * 7;

        this.data.expressRouter = Express.Router();

        this.data.expressRouter.use(Express.json());
        this.data.expressRouter.use(Express.urlencoded({ extended: false }));

        this.data.expressRouter.use(CookieParser());

        this.data.expressRouter.use(ExpressSession({
            name: this.name,
            secret: this.data.cookieSecret,
            cookie: {
                maxAge: this.data.cookieMaxAge,
                secure: true
            },
            store: this.data.sessionStore,
            saveUninitialized: true, // TODO setze saveUninitialized auf false
            resave: false
        }));

        this.data.expressRouter.use(requestRouter.bind(this));

        // TODO darf die session hier public werden?

    } // ExpressPEP#constructor

    /**
     * @name ExpressPEP#router
     * @type {function}
     * @param {object} request
     * @param {object} response
     * @param {function} next
     * @readonly
     * @public
     */
    get router() {
        return this.data.expressRouter;
    } // ExpressPEP#router<getter>

} // ExpressPEP

//#endregion ExpressPEP

//#region SocketIoPEP

/**
 * @name SocketIoPEP
 * @extends GenericPEP
 */
class SocketIoPEP extends GenericPEP {

} // SocketIoPEP

//#endregion SocketIoPEP


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