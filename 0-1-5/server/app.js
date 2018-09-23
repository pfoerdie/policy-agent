(async (/* closure */) => {

    //#region PolicyAgent

    const PolicyAgent = require('..');

    /**
     * -> Desktop:
     * /d/Programme/Neo4j/neo4j-community-3.4.0/bin/neo4j.bat console
     * /d/Programme/MongoDB/mongodb-community-4.0.0/bin/mongod --dbpath=D:/Programme/MongoDB/databases/examplePIPdataBase
     * /d/Programme/MongoDB/mongodb-compass-community-1.14.5/MongoDBCompassCommunity.exe
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
        attributePIP = new PolicyAgent.PIP.AttributeStore({
            '@id': "/PIP/the-worlds-attributes"
        }),
        policyPIP = new PolicyAgent.PIP.PolicyStore({
            '@id': "/PIP/the-worlds-policies",
            'password': "odrl"
        });

    // await attributePIP.ping();
    // await policyPIP.ping();

    expressPEP.connectPDP(accessPDP);

    accessPDP.connectPIP(policyPIP);
    accessPDP.connectPIP(attributePIP);

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
    // .catch(console.error)
    .catch(err => null);