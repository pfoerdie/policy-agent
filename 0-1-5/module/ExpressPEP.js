/**
 * @module PolicyAgent.PEP.express
 * @author Simon Petrac
 */

const
    GenericPEP = require('../core/PEP.js'),
    UUID = require('uuid/v4'),
    CookieParser = require('cookie-parser'),
    Express = require('express'),
    ExpressSession = require('express-session');

//#region ExpressPEP

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
                '@type': "html", // TODO wie komme ich an den richtigen Typ?
                '@id': request.url // IDEA oder aus dem request.body
            };

            param['assigner'] = null; // IDEA aus dem request.body
            // IDEA ist der PEP vllt selber der assigner?
            param['assignee'] = null; // IDEA aus der request.session oder dem request.body

            // IDEA wäre nice, wenn das auch mit this.request klappt
            // TODO
            response.send('hello world');

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
 * @extends GenericPEP
 */
class ExpressPEP extends GenericPEP {
    /**
     * @constructs ExpressPEP
     * @param {JSON} [options={}]
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.cookieSecret = UUID();
        this.data.cookieMaxAge = 60 * 60 * 24 * 7;

        this.data.requestAction = 'use';

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

//#endregion ExpressPEP

Object.defineProperty(GenericPEP, 'express', {
    enumerable: true,
    value: ExpressPEP
});