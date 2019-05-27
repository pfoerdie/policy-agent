const
    Http = require('http'),
    BodyParser = require('body-parser'),
    Express = require('express'),
    ExpressSession = require('express-session'),
    Setup = require("./setup.js"),
    _defineActions = require("./defineActions.js");

Setup.ready(_main);

async function _main(policyAgent) {

    let
        { pep } = policyAgent,
        app = Express(),
        server = Http.createServer(app);

    _defineActions(pep);

    app.use(BodyParser.urlencoded({ extended: true }));
    app.use(BodyParser.json());

    app.use(ExpressSession({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    }));

    let
        getFiles = ["/", "/favicon.ico"],
        tmpRplStr = getFiles.map(str => str.replace(/\/|\./g, match => "\\" + match)).join("|"),
        RE_files = new RegExp(`^(?:${tmpRplStr})$`);

    app.use(function (request, response, next) {
        console.log("__________________________________________________\n");
        next();
    });

    app.get(RE_files, function (request, response, next) {
        let
            param = {
                action: "readFile",
                target: {
                    '@type': "File",
                    '@id': request.url
                }
            },
            session = request.session,
            args = [response];

        pep.request(param, session, ...args).catch(next);
    });

    app.use(function (request, response, next) {
        let
            param = request.body,
            session = request.session,
            args = [response];

        if (!param['action']) response.sendStatus(400);
        else pep.request(param, session, ...args).catch(next);
    });

    server.listen(80, () => console.log("App running"));
} // _main