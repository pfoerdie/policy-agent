/**
 * @module PEP
 * @author Simon Petrac
 */

const
    express = require('express'),
    socketIO = require('socket.io'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    memoryStore = require('memorystore')(expressSession),
    PDP = require('PDP'),
    PEP = {};

let // private variables
    _private = {},
    _userData = new Map();

function getUserData(userId) {
    let userData = _userData.get(userId);

    if (!userData) {
        userData = {
            sessions: [],
            sockets: []
        };

        _userData.set(userId, userData);
    }

    return userData;
} // getUserData

/**
 * This object contains all public methods.
 * @name PEP.public
 * @type {Object}
 */
PEP.public = Object.create({}, {

    /**
     * TODO
     */
    'init': {
        enumerable: true,
        value: (options) => {
            options = options || {};
            options['maxAge'] = options['maxAge'] || 1e3 * 60 * 60 * 24 * 7; // 1e3 ms * 60 s * 60 min * 24 h * 7 days = 1 week
            options['checkPeriod'] = options['checkPeriod'] || 1e3 * 60 * 60 * 24; // 1e3 ms * 60 s * 60 min * 24 h = 1 day
            options['secret'] = options['secret'] || 'super_duper_secret'; // TODO durch generiertes secret ersetzen

            _private.jsonBodyParser = bodyParser.json();
            _private.urlBodyParser = bodyParser.urlencoded({ extended: true });

            _private.sessionStore = expressSession({
                cookie: {
                    maxAge: options['maxAge'],
                    path: '/',
                    HttpOnly: false,
                    secure: false, // TODO change to true with SSL
                },
                resave: false,
                rolling: true,
                saveUninitialized: false,
                secret: options['secret'],
                store: new memoryStore({
                    checkPeriod: options['checkPeriod'],
                })
            });

            _private.initialized = true;
        }
    }, // PEP.public.init

    /**
     * TODO
     * {@link https://www.npmjs.com/package/socket.io socket.io - npm}
     */
    'socketIO': {
        enumerable: true,
        value: (server) => {
            if (!_private.initialized)
                throw new Error(`PEP is not initialized`);

            let io = socketIO(server, {
                /**
                 * NOTE SocketIO options:
                 * path (String):           name of the path to capture (/socket.io)
                 * serveClient (Boolean):   whether to serve the client files (true)
                 * adapter (Adapter):       the adapter to use. Defaults to an instance of the Adapter that ships with socket.io which is memory based. 
                 *                          See {@link https://github.com/socketio/socket.io-adapter socket.io-adapter}
                 * origins (String):        the allowed origins (*)
                 * parser (Parser):         the parser to use. Defaults to an instance of the Parser that ships with socket.io. 
                 *                          See {@link https://github.com/socketio/socket.io-parser socket.io-parser}.
                 * 
                 * NOTE EngineIO options:
                 * pingTimeout (Number):                how many ms without a pong packet to consider the connection closed (5000)
                 * pingInterval (Number):               how many ms before sending a new ping packet (25000)
                 * upgradeTimeout (Number):             how many ms before an uncompleted transport upgrade is cancelled (10000)
                 * maxHttpBufferSize (Number):          how many bytes or characters a message can be, before closing the session (to avoid DoS). Default value is 10E7.
                 * allowRequest (Function):             A function that receives a given handshake or upgrade request as its first parameter, and can decide whether to continue or not. 
                 *                                      The second argument is a function that needs to be called with the decided information: fn(err, success), where success is a boolean value where false means that the request is rejected, and err is an error code.
                 * transports (<Array> String):         transports to allow connections to (['polling', 'websocket'])
                 * allowUpgrades (Boolean):             whether to allow transport upgrades (true)
                 * perMessageDeflate (Object|Boolean):  parameters of the WebSocket permessage-deflate extension (see {@link https://github.com/websockets/ws ws module} api docs). 
                 *                                      Set to false to disable. (true)
                 * threshold (Number):                  data is compressed only if the byte size is above this value (1024)
                 * httpCompression (Object|Boolean):    parameters of the http compression for the polling transports (see {@link https://nodejs.org/api/zlib.html#zlib_options zlib} api docs). 
                 *                                      Set to false to disable. (true)
                 * threshold (Number):                  data is compressed only if the byte size is above this value (1024)
                 * cookie (String|Boolean):             name of the HTTP cookie that contains the client sid to send as part of handshake response headers. Set to false to not send one. (io)
                 * cookiePath (String|Boolean):         path of the above cookie option. If false, no path will be sent, which means browsers will only send the cookie on the engine.io attached path (/engine.io). Set false to not save io cookie on all requests. (/)
                 * cookieHttpOnly (Boolean):            If true HttpOnly io cookie cannot be accessed by client-side APIs, such as JavaScript. (true) This option has no effect if cookie or cookiePath is set to false.
                 * wsEngine (String):                   what WebSocket server implementation to use. Specified module must conform to the ws interface (see {@link https://github.com/websockets/ws/blob/master/doc/ws.md ws module api docs}). 
                 *                                      Default value is ws. An alternative c++ addon is also available by installing uws module.
                 * initialPacket (Object):              an optional packet which will be concatenated to the handshake packet emitted by Engine.IO.
                 */
            });

            io.use((socket, next) => {
                _private.sessionStore(socket.request, socket.request.res, next);
            });

            io.on('connection', (clientSocket) => {
                const
                    session = clientSocket.request.session;

                console.log('clientSocket.id:', clientSocket.id);
                console.log('session.id:', session.id);

                // TODO die richtige Session hier hin bekommen
                // TODO request and den PEP auflösen

                clientSocket.on('disconnect', () => {
                    console.log('disconnected:', clientSocket.id);
                });

                session.save();
                console.log('// socketIO\n');
            });
        }
    }, // PEP.public.socketIO

    /**
     * TODO
     * {@link https://nodejs.org/api/http.html http - node.js}
     * {@link https://www.npmjs.com/package/http-request-parser http-request-parser - npm}
     */
    'http': {
        enumerable: true,
        value: (request, response) => {
            throw new Error(`not implemented jet`);
        }
    }, // PEP.public.http

    /**
     * TODO
     * {@link https://www.npmjs.com/package/express express - npm}
     * {@link https://www.npmjs.com/package/body-parser body-parser - npm}
     * {@link https://www.npmjs.com/package/express-session express-session - npm}
     * {@link https://www.npmjs.com/package/memorystore memorystore - npm}
     */
    'express': {
        enumerable: true,
        value: (app, path) => {
            if (!_private.initialized)
                throw new Error(`PEP is not initialized`);

            let expressRouter = express.Router();

            expressRouter.use(_private.jsonBodyParser);
            expressRouter.use(_private.urlBodyParser);

            expressRouter.use(_private.sessionStore);

            expressRouter.use((request, response, next) => {
                const
                    session = request.session,
                    body = request.body;

                session.user = session.user || "test";
                console.log("requested:", request.url);

                console.log('session.id:', session.id);

                response.sendFile("D:/Dokumente/NodeJS/projects/PolicyAgent/website/index.html");

                session.save();
                console.log('// express\n');
            });

            if (path) app.use(path, expressRouter);
            else app.use(expressRouter);
        }
    }, // PEP.public.express

    /**
     * TODO
     */
    'request': {
        enumerable: true,
        value: (args) => {

        }
    }

}); // PEP.public

module.exports = PEP;