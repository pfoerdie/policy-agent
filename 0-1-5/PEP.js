/**
 * @module PolicyAgent.PEP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    CookieParser = require('cookie-parser'),
    Express = require('express'),
    ExpressSession = require('express-session'),
    SessionMemoryStore = require('session-memory-store')(ExpressSession),
    PolicyPoint = require('./PolicyPoint.js'),
    Context = require('./Context.js'),
    PDP = require('./PDP.js');

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

        super(options);

        this.data.sessionMaxAge = 60 * 60 * 24 * 7;

        this.data.sessionStore = new SessionMemoryStore({
            expires: this.data.sessionMaxAge
        });

        this.data.decisionPoints = new Set();
    } // GenericPEP.constructor

    /**
     * Adds a PDP to resolve decision request.
     * @name PEP#connectPDP
     * @param {PolicyAgent.PDP} decisionPoint 
     */
    connectPDP(decisionPoint) {
        if (!(decisionPoint instanceof PDP))
            this.throw('connectPDP', new TypeError(`invalid argument`));
        if (this.data.decisionPoints.has(decisionPoint))
            this.throw('connectPDP', new Error(`decisionPoint already connected`));

        this.data.decisionPoints.add(decisionPoint);

        this.log('connectPDP', `${decisionPoint.toString(undefined, true)} connected`);
    } // PEP#connectPDP

    /**
     * @name GenericPEP#request
     * @param {Session} session
     * @param {JSON} param
     * @returns {*}
     * @async
     */
    async request(session, subject) {

        /**
         * INFO
         * It is not possible to validate the session at this point.
         * All other validation will be done by the Context's constructor.
         */

        let promises = [];
        this.data.decisionPoints.forEach(decisionPoint => promises.push(
            (async (resolve, reject) => {
                try {
                    let
                        context = new Context(session, subject),
                        result = await context.next(decisionPoint._request);

                    return [null, result, context];
                } catch (err) {
                    return [err];
                }
            })(/* INFO call the async function immediately to get a promise */)
        ));

        let results = (await Promise.all(promises)).filter(([err]) => !err);
        if (results.length === 0)
            this.throw('request', new Error(`failed to resolve`));

        /**
         * NOTE 7.2.1 Base PEP
         * - If the decision is "Permit", then the PEP SHALL permit access.  
         *   If obligations accompany the decision, then the PEP SHALL permit access only if it understands and it can and will discharge those obligations.
         * - If the decision is "Deny", then the PEP SHALL deny access.
         *   If obligations accompany the decision, then the PEP shall deny access only if it understands, and it can and will discharge those obligations.
         * - If the decision is “NotApplicable”, then the PEP’s behavior is undefined.
         * - If the decision is “Indeterminate”, then the PEP’s behavior is undefined.
         */

        // TODO Auswahl des Contexts
        // TODO Aktionen ausführen (Deny-biased PEP vs Permit-biased PEP)
        // TODO Rückgabewert feststellen

    } // GenericPEP#request

} // GenericPEP

//#endregion GenericPEP

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

            let subject = { 'action': {}, 'relation': {}, 'function': {} };

            subject['action']['@id'] = this.data.requestAction; // IDEA oder aus dem request.body

            subject['relation']['target'] = {
                '@type': "html", // TODO wie komme ich an den richtigen Typ?
                '@id': request.url // IDEA oder aus dem request.body
            };

            subject['function']['assigner'] = null; // IDEA aus dem request.body
            subject['function']['assignee'] = null; // IDEA aus der request.session oder dem request.body

            let context = new Context(request.session, subject); // IDEA wäre nice, wenn das auch mit this.request klappt

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
    constructor(options) {
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

//#region SocketIoPEP

/**
 * @name SocketIoPEP
 * @extends GenericPEP
 */
class SocketIoPEP extends GenericPEP {

} // SocketIoPEP

//#endregion SocketIoPEP

Object.defineProperties(GenericPEP, {
    'express': {
        enumerable: true,
        value: ExpressPEP
    },
    'socketIO': {
        enumerable: true,
        value: SocketIoPEP
    }
});

module.exports = GenericPEP;