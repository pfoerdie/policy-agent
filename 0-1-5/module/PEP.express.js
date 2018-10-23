/**
 * Express PEP
 * @module PolicyAgent.PEP.express
 * @author Simon Petrac
 */

const
    PEP = require('../core/PEP.js'),
    UUID = require('uuid/v4'),
    CookieParser = require('cookie-parser'),
    Express = require('express'),
    ExpressSession = require('express-session');

/**
 * Must be called after all other this.data for the ExpressPEP have been set.
 * @name ExpressPEP~initializeExpressRouter
 * @return {Express~Router}
 * @this {ExpressPEP}
 */
function initializeExpressRouter() {

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

    this.data.expressRouter.use(async (request, response, next) => {
        try {

            let param = {};

            param['action'] = {
                '@id': this.data.requestAction // IDEA oder aus dem request.body
            };

            param['target'] = {
                '@type': "content", // TODO wie komme ich an den richtigen Typ?
                '@id': request.url // IDEA oder aus dem request.body
            };

            param['assigner'] = null; // IDEA aus dem request.body
            // IDEA ist der PEP vllt selber der assigner?
            param['assignee'] = null; // IDEA aus der request.session oder dem request.body

            let result = await this.request(request.session, param);
            response.send("" + result);

        } catch (err) {
            // INFO remove the session from the request
            delete request.session;
            delete request.sessionID;
            next();
        }
    });

} // ExpressPEP~initializeExpressRouter

/**
 * @name ExpressPEP
 * @extends PEP
 */
class ExpressPEP extends PEP {
    /**
     * @constructs ExpressPEP
     * @param {JSON} [options={}]
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.cookieSecret = UUID();
        this.data.cookieMaxAge = 60 * 60 * 24 * 7;

        // TODO this.data.requestAction = 'use';
        this.data.requestAction = 'read';

        initializeExpressRouter.call(this);

    } // ExpressPEP.constructor

    /**
     * @name ExpressPEP#router
     * @type {function}
     * @readonly
     * @public
     */
    get router() {
        return this.data.expressRouter;
    } // ExpressPEP#router<getter>

} // ExpressPEP

Object.defineProperty(PEP, 'express', {
    enumerable: true,
    value: ExpressPEP
});