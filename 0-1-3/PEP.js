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
 * Policy Enforcement Point
 * @name PEP
 */
class PEP extends PolicyPoint {
    /**
     * @constructs PEP
     * @param {*} options 
     */
    constructor(options = {}) {
        super('PEP');

        Object.defineProperties(this.param, {
            cookieName: {
                writable: true,
                value: Utility.validParam('string', options.cookieName, UUID())
            },
            cookieSecret: {
                writable: true,
                value: Utility.validParam('string', options.cookieSecret, UUID())
            },
            cookieMaxAge: {
                writable: true,
                value: 1e3 * Utility.validParam('number', options.cookieMaxAge, 60 * 60 * 24 * 7)
            },
            cookieSecure: {
                writable: true,
                value: Utility.validParam('boolean', options.cookieSecure, true)
            }
        });

        Object.defineProperties(this.data, {
            expressSession: {
                value: ExpressSession({
                    name: this.param.cookieName,
                    secret: this.param.cookieSecret,
                    cookie: {
                        maxAge: this.param.cookieMaxAge,
                        secure: this.param.cookieSecure
                    },
                    store: new SessionMemoryStore({
                        expires: this.param.cookieMaxAge
                    }),
                    saveUninitialized: true, // TODO PEP#constructor -> set saveUninitialized to false
                    resave: false
                })
            },
            expressRouter: {
                configurable: true,
                writable: true,
                value: null
            },
            socketIORouter: {
                configurable: true,
                writable: true,
                value: null
            },
            connectedPDPs: {
                value: []
            }
        });
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
                        '@type': "content", // TODO PEP#expressRouter -> welchen @type nutzt man hier?
                        '@id': request.url
                    };

                    if (request.body.username && request.body.password) {
                        param.assignee = {
                            '@type': "user",
                            'username': request.body.username,
                            'password': request.body.password
                        };
                    }

                    param.assigner = request.body.assigner || null;
                    param.action = request.body.action || 'read'; // TODO PEP#expressRouter -> welches ist die default action?

                    let result = await this.request(session, param);

                    // TODO PEP#expressRouter -> was passiert nun mit dem request?

                    if (result && result['@type'] === param.target['@type']) {
                        // NOTE PEP#expressRouter -> temporär
                        if (result.mimeType) response.type(result.mimeType);

                        switch (result.type) {
                            case 'File':
                                response.sendFile(Path.join(__dirname, 'App', result.path));
                                break;

                            case 'string':
                                response.send(result.value);
                                break;

                            default:
                                response.status(404).end();
                        }
                    } else {
                        response.status(404).end();
                    }

                    // response.sendFile(Path.join(__dirname, "App/app.html"));

                    // response.send(result);

                } catch (err) {
                    // TODO PEP#expressRouter -> Error handling
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
                this.data.expressSession(socket.request, socket.request.res, (/* next */) => {
                    // TODO PEP#socketIO -> session besser kapseln, sonst wird das über socket.request.session public

                    socket.on('request', async (param, callback) => {
                        let session = socket.request.session;

                        try {
                            let result = await this.request(session, param);

                            if (result.target && result.target['@type'] === 'Asset') {
                                callback(result.target.data);
                            } else {
                                callback(null);
                            }

                            // TODO PEP#socketIO -> hier weitermachen

                        } catch (err) {
                            callback(err); // TODO PEP#socketIO -> error handling
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
     * @returns // TODO jsDoc PEP#request -> @returns
     * @async
     * @public
     */
    async request(session, param) {
        if (session instanceof Context)
            session = session.session;

        // TODO PEP#request -> falls der SessionMemoryStore die session nicht hat, muss ein error geworfen werden, denke ich

        let context = new Context(session, param);
        context.param.consoleOutput = true;
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