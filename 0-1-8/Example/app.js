const
    Http = require('http'),
    BodyParser = require('body-parser'),
    Express = require('express'),
    ExpressSession = require('express-session'),
    Setup = require("./setup.js");

Setup.ready(_main);

async function _main(policyAgent) {

    let
        { pep, pdp, pip, pap } = policyAgent,
        app = Express(),
        server = Http.createServer(app);

    app.use(BodyParser.urlencoded({ extended: false }));
    app.use(BodyParser.json());

    app.use(ExpressSession({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    }));

    app.get("/", function (request, response) {
        let
            param = {
                action: "readFile",
                target: {
                    '@type': "File",
                    '@id': "/"
                }
            },
            session = request.session,
            args = [response];

        pep.request(param, session, ...args).then((result) => {
            response.type('text/html').send(result);
        }).catch(next);
    });

    app.use(function (request, response, next) {
        let
            param = request.body,
            session = request.session,
            args = [response];

        pep.request(param, session, ...args).catch(next);
    });

    server.listen(80, () => console.log("running"));
} // _main