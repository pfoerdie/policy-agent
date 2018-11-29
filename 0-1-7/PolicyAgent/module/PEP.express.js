/**
 * Express PEP
 * @module PolicyAgent.PEP.express
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    CookieParser = require('cookie-parser'),
    Express = require('express'),
    ExpressSession = require('express-session');

module.exports = (PEP) => {

    /**
     * Must be called after all other this.data for the ExpressPEP has been set.
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
                    '@type': "File", // TODO wie komme ich an den richtigen Typ?
                    '@id': request.url // IDEA oder aus dem request.body
                };

                param['assigner'] = null; // IDEA aus dem request.body
                // IDEA ist der PEP vllt selber der assigner?
                param['assignee'] = null; // IDEA aus der request.session oder dem request.body

                let result = await this.request(request.session, param);

                if (result && result['@type'] === 'File' && typeof result['mimeType'] === 'string' && result['@value'])
                    response.type(result['mimeType']).send(result['@value']);
                else
                    response.status(404).send();


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

    return ExpressPEP;

}; // module.exports