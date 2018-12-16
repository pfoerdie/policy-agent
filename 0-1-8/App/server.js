(async (/* closure */) => {

    //#region PolicyAgent

    const
        Path = require('path'),
        PolicyAgent = require('../PolicyAgent');

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
        my_PIP = new PolicyAgent.PIP({
            '@id': "/PIP/the-worlds-attributes",
            'dbName': "SubjectsPoint"
        }),
        myPAP = new PolicyAgent.PAP({
            '@id': "/PIP/the-worlds-policies",
            'password': "odrl"
        }),
        accessPDP = new PolicyAgent.PDP({
            '@id': "/PDP/access-to-the-world",
            'PAP': myPAP,
            'sPIP': my_PIP,
            'rPIP': my_PIP,
            'ePIP': my_PIP
        }),
        expressPEP = new PolicyAgent.PEP.express({
            '@id': "/PEP/hello-world",
            'PDP': accessPDP,
            'root': Path.join(__dirname, "webapp")
        });

    // expressPEP.defineAction('read', 'use', undefined, target => target['@value'].toString());
    // expressPEP.defineAction('login', 'use', undefined, target => {
    //     console.log(target);
    //     // TODO die Session wird hier benötigt
    //     return false;
    // });

    //#endregion PolicyAgent

    //#region ExpressServer

    const
        Express = require('express'),
        Http = require('http');

    let
        app = Express(),
        server = Http.createServer(app);

    app.use(expressPEP.router);

    app.use((request, response, next) => {
        response.send('request failed');
    });

    server.listen(80, () => console.log("server listening"));

    //#endregion ExpressServer

})(/* closure */)
    .catch(err =>
        console.error(err)
    );
    // .catch(err => null);