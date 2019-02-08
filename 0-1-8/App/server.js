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



    //#endregion PolicyAgent

    //#region ExpressServer

    const
        Express = require('express'),
        Http = require('http');

    let
        app = Express(),
        server = Http.createServer(app);

    app.use((request, response, next) => {
        // TODO PEP.request anfragen
        response.send('request failed');
    });

    server.listen(80, () => console.log("server listening"));

    //#endregion ExpressServer

})(/* closure */)
    .catch(err =>
        console.error(err)
    );
    // .catch(err => null);