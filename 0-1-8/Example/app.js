const
    Http = require('http'),
    Express = require('express'),
    Setup = require("./setup.js");

Setup.ready(_main);

async function _main(policyAgent) {

    let
        { pep, pdp, pip, pap } = policyAgent,
        app = Express(),
        server = Http.createServer(app);

    app.use(function (request, response, next) {

    });

    server.listen(80, () => console.log("running"));
} // _main