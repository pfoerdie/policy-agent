(async (/* closure */) => {

    //#region PolicyAgent

    const
        Path = require('path'),
        { PEP, PDP, PIP, PAP } = require('../PolicyAgent'),
        _promify = (fn, ...args) => new Promise((resolve, reject) => fn(...args, (err, result) => err ? reject(err) : resolve(result)));

    /**
     * -> Desktop:
     * /d/Programme/Neo4j/neo4j-community-3.4.0/bin/neo4j.bat console
     * /d/Programme/MongoDB/mongodb-community-4.0.0/bin/mongod --dbpath=D:/Programme/MongoDB/databases/examplePIPdataBase
     * 
     * -> IdeaPad:
     * /d/Programme/Neo4j/neo4j-community-3.4.5/bin/neo4j.bat console
     * /d/Programme/MongoDB/mongodb-community-4.0.0/bin/mongod --dbpath=D:/Programme/MongoDB/databases/examplePIPdataBase
     */

    let
        pip = new PIP({ 'host': "localhost", 'port': 27017, 'dbName': "InformationPoint" }),
        pap = new PAP({ 'host': "localhost", 'port': 7687, 'user': "neo4j", 'password': "odrl" }),
        pdp = new PDP({ 'PIP': pip, 'PAP': pap }),
        pep = new PEP({ 'PDP': pdp });

    pep.defineAction('login', function (session) {
        if (this['assignee'])
            session['assignee'] = this['assignee'];
    }, 'use', []);

    pep.defineAction('logout', function (session) {
        delete session['assignee'];
    }, 'use', []);

    pep.defineAction('readFile', async function (session, ...args) {
        let target = this['target'];
        if (!target || target['@type'] !== "File")
            return null;

        return {
            type: target['mimeType'],
            buffer: await _promify(Fs.readFile, Path.join(__dirname, 'webapp', target['path']))
        };
    }, 'use', []);

    pep.defineAction('listMembers', async function (session, ...args) {

        return [/* TODO */];

    }, 'use', []);

    pep.defineAction('Kunde:auflisten', async function () {
        let target = this['target'];
        if (!target || target['@type'] !== 'Warenkatalog') {
            let warenArr = await this.implies.memberOf();
            return warenArr.filter(ware => ware.bestand > 0).map((ware) => ({
                id: ware.produktID,
                name: ware.bezeichnung,
                preis: ware.preis
            }));
        }
    }, 'use', ['listMembers']);

    //#endregion PolicyAgent

    //#region ExpressServer

    const
        Express = require('express'),
        BodyParser = require('body-parser'),
        ExpressSession = require('express-session'),
        Http = require('http');

    let
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

    app.use(async (request, response, next) => {
        try {
            let
                readFile = !(request.body && request.body.action && request.body.target),
                param = readFile ? {
                    'action': "readFile",
                    'target': { '@type': "File", '@id': request.url }
                } : request.body,
                session = request.session,
                args = Array.isArray(request.body.args) ? request.body.args : [],
                result = await pep.request(param, session, ...args);

            if (readFile) {
                if (result) response.type(result.type).send(result.buffer);
                else response.sendStatus(404);
            } else {
                response.send(result);
            }

        } catch (err) {
            console.error(err);
            response.sendStatus(500);
        }
    });

    server.listen(80, () => console.log("server listening"));

    //#endregion ExpressServer

})(/* closure */)
    .catch(console.error);
    // .catch(err => null);