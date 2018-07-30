/**
 * @module PolicyAgent~PEP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    PolicyPoint = require(Path.join(__dirname, "PolicyPoint.js")),
    Context = require(Path.join(__dirname, "Context.js")),
    PDP = require(Path.join(__dirname, "PDP.js")),
    CookieParser = require('cookie-parser'),
    UUID = require('uuid/v4'),
    Express = require('express'),
    ExpressSession = require('express-session'),
    SessionMemoryStore = require('session-memory-store')(ExpressSession);


/**
 * @name PEP
 */
class PEP extends PolicyPoint {

    constructor(options = {}) {
        super('PEP');

        this.param.cookieName = Utility.validParam('string', options.cookieName, UUID());
        this.param.cookieSecret = Utility.validParam('string', options.cookieSecret, UUID());
        this.param.cookieMaxAge = 1e3 * Utility.validParam('number', options.cookieMaxAge, 60 * 60 * 24 * 7); // 1 week (TODO ist das richtig mit den 1e3?)
        this.param.cookieSecure = Utility.validParam('boolean', options.cookieSecure, true);

        this.data.expressSession = ExpressSession({
            name: this.param.cookieName,
            secret: this.param.cookieSecret,
            cookie: {
                maxAge: this.param.cookieMaxAge,
                secure: this.param.cookieSecure
            },
            store: new SessionMemoryStore({
                expires: this.param.cookieMaxAge
            }),
            saveUninitialized: true, // TODO set to false
            resave: false
        });

        this.data.expressRouter = null;

        this.data.connectedPDPs = [];

        // TODO PEP#constructor

    } // PEP#constructor

    /**
     * @name PEP#ready
     * @inheritdoc
     */
    get ready() {
        if (this.data.connectedPDPs.length === 0) {
            console.warn(this.toString('ready', null, `there are no connected PDPs`));
            return false;
        }

        return super.ready;
    } // PEP#ready<getter>

    /**
     * A router for an express app that enforces all requests.
     * @name PEP#expressRouter
     * @type {function}
     * @public
     */
    get expressRouter() {

        if (!this.data.expressRouter) {

            this.data.expressRouter = Express.Router();

            this.data.expressRouter.use(Express.json());
            this.data.expressRouter.use(Express.urlencoded({ extended: false }));

            this.data.expressRouter.use(CookieParser());

            this.data.expressRouter.use(this.data.expressSession);

            this.data.expressRouter.use(async (request, response, next) => {
                if (!this.ready) return next();

                let session = request.session;

                try {
                    let param = {};

                    param.target = {
                        '@type': "Asset",
                        url: request.url
                    };

                    if (request.body.username && request.body.password) {
                        param.assignee = {
                            '@type': "Party",
                            username: request.body.username,
                            password: request.body.password
                        };
                    }

                    param.assigner = request.body.assigner || null;
                    param.action = request.body.action || 'use';

                    console.log('param:', param);

                    let result = await this.request(session, param);

                    // TODO hier weitermachen -> request verbessern
                    // TODO nicht den context als result zurückgeben

                    let target = result.data.target;
                    if (target && target['@type'] === 'Asset') {
                        // TODO temp
                        response.type(target.contentType);
                        response.send(target.content);
                    } else {
                        response.status(404).end();
                    }

                    // response.sendFile(Path.join(__dirname, "App/app.html"));

                    // response.send(result);

                } catch (err) {
                    // TODO Error handling
                    console.error(err);
                    response.status(500).end();
                    /**
                     * INFO HTTP-Statuscodes
                     * {@link https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml HTTP Status Code Registry - iana}
                     * {@link https://developer.mozilla.org/de/docs/Web/HTTP/Status HTTP response status codes - MDN}
                     */
                }
            }); // -> this is the main part of the route, where the context gets created

        } // -> creates the expressRouter, if it does not exist

        return this.data.expressRouter;
    } // PEP#expressRouter<getter>

    /**
     * A router for a socket.io instance that enforces all sockets.
     * @name PEP#socketIO
     * @type {function}
     * @public
     */
    get socketIO() {

        if (!this.data.socketIORouter) {
            this.data.socketIORouter = (socket, next) => {
                // NOTE this will only be called once at the creation of a new socket
                this.data.expressSession(socket.request, socket.request.res, (/* next */) => {
                    // TODO PEP#socketIO<getter> -> session besser kapseln, sonst wird das über socket.request.session public

                    socket.on('request', async (param, callback) => {
                        let session = socket.request.session;

                        try {
                            let result = await this.request(session, param);

                            // TODO PEP#socketIO<getter> weitermachen

                            callback(context.data); // TODO PEP#socketIO<getter>
                        } catch (err) {
                            callback(err); // TODO PEP#socketIO<getter>
                        }
                    });

                    /*
                    socket.on('disconnect', () => {
                        console.warn('disconnected');
                    });
                    */

                    next();
                });
            };
        }

        return this.data.socketIORouter;
    } // PEP#socketIO<getter>

    /**
     * Creates a context and sends a request to the connected PDPs.
     * @name PEP#request
     * @param {(Session|PolicyAgent~Context)} session The session for the context. If session is a Context itself, the session will be inherited.
     * @param {JSON} param The parametrization for the context.
     * @returns // TODO
     * @async
     * @public
     */
    async request(session, param) {
        if (session instanceof Context)
            session = session.session;

        // TODO PEP#request -> falls der SessionMemoryStore die session nicht hat, muss ein error geworfen werden, denke ich

        let context = new Context(session, param);
        context.log(`context was created by ${this.toString('request', 'session, param')}`);

        for (let targetPDP of this.data.connectedPDPs) {
            let result = await targetPDP._request(context);
            // TODO PEP#request -> falls der PEP das result nicht auflösen kann, soll die for-Schleife weiterlaufen, sonst return result
            context.log(this.toString('request', null, `context returned from ${targetPDP.toString()} successfully`));
            return result;
        }

        context._audit('error', this.toString('request', null, `no connected PDP could resolve the request`));

        return {
            '@type': "Error", // TODO überdenken
            '@value': this.toString('request', null, `no connected PDP could resolve the request`)
        };
    } // PEP#request

    /**
     * Connected PDPs will be used in the order of connection.
     * @name PEP#connectPDP
     * @param {PDP} targetPDP The PDP to connect.
     * @returns {undefined}
     * @public
     */
    connectPDP(targetPDP) {
        if (!(targetPDP instanceof PDP))
            throw new Error(this.toString('connectPDP', 'targetPDP', `targetPDP has to be a PDP`));
        if (this.data.connectedPDPs.includes(targetPDP))
            throw new Error(this.toString('connectPDP', 'targetPDP', `targetPDP has already been connected`));

        this.data.connectedPDPs.push(targetPDP);
    } // PEP#connectPDP

} // PEP

Utility.getPublicClass(PEP);
module.exports = PEP;