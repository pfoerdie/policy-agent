(async (/* closure */) => {

    //#region PolicyAgent

    const
        Path = require('path'),
        PolicyAgent = require('..');

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
        expressPEP = new PolicyAgent.PEP.express({
            '@id': "/PEP/hello-world"
        }),
        accessPDP = new PolicyAgent.PDP({
            '@id': "/PDP/access-to-the-world"
        }),
        myPIP = new PolicyAgent.PIP({
            '@id': "/PIP/the-worlds-attributes"
        }),
        myPAP = new PolicyAgent.PAP({
            '@id': "/PIP/the-worlds-policies",
            'password': "odrl"
        });

    expressPEP.connectPDP(accessPDP);

    expressPEP.defineAction('read', 'use', undefined, subj => JSON.stringify(subj, undefined, "****").replace(/\*/g, "&nbsp;").replace(/\n/g, "<br>"));

    accessPDP.connectPIP(myPIP);
    accessPDP.connectPAP(myPAP);

    myPIP.connectSP(new PolicyAgent.SP({}));

    myPIP.connectRP(new PolicyAgent.RP({
        'root': Path.join(__dirname, "webapp")
    }));

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