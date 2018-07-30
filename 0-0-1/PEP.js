const
    express = require('express'),
    socketIO = require('socket.io'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    memoryStore = require('memorystore')(expressSession);

const
    private = new WeakMap();

class PEP {
    constructor(options) {
        const private = {};

        options = options || {};
        options['maxAge'] = options['maxAge'] || 1e3 * 60 * 60 * 24 * 7; // 1e3 ms * 60 s * 60 min * 24 h * 7 days = 1 week
        options['checkPeriod'] = options['checkPeriod'] || 1e3 * 60 * 60 * 24; // 1e3 ms * 60 s * 60 min * 24 h = 1 day
        options['secret'] = options['secret'] || 'super_duper_secret'; // TODO durch generiertes secret ersetzen

        private.jsonBodyParser = bodyParser.json();
        private.urlBodyParser = bodyParser.urlencoded({ extended: true });

        private.sessionStore = expressSession({
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

        private.initialized = true;

        _private.set(this, {});
    }

    express() {

    }

    connectPEP
}

module.exports = PEP;