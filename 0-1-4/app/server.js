const
    PolicyAgent = require('..'),
    MongoStore = PolicyAgent.DataStore.MongoDB,
    Neo4jStore = PolicyAgent.DataStore.Neo4j,
    PIP = PolicyAgent.PIP,
    PDP = PolicyAgent.PDP,
    PEP = PolicyAgent.PEP,
    PAP = PolicyAgent.PAP;

const
    HTTP = require('http'),
    Express = require('express'),
    SocketIO = require('socket.io');

/**
 * NOTE start Neo4j and MongoDB:
 * /d/Programme/Neo4j/neo4j-community-3.4.5/bin/neo4j.bat console
 * /d/Programme/MongoDB/mongodb-community-4.0.0/bin/mongod --dbpath=D:/Programme/MongoDB/databases/examplePIPdataBase
 */

(async (/* TESTING */) => {

    const
        attributeStore = new MongoStore(undefined, 'AttributeStore'),
        policyStore = new Neo4jStore(undefined, undefined, 'odrl'),
        myPIP = new PIP(attributeStore),
        myPDP = new PDP(policyStore, myPIP),
        myPEP = new PEP(),
        myPAP = new PAP(policyStore);

    myPEP.connectPDP(myPDP);

    /* */
    let
        app = Express(),
        server = HTTP.createServer(app),
        io = SocketIO(server);
    /* *
    app.use(PEP.express());
    io.use(PEP.socketIO());
    /* *
    server.listen(80, () => console.log('HTTP-Server -> listening'));
    /* */

    return 0;
    // NOTE was cooleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeees

})(/* TESTING */).then(result => {
    // console.log(result);
}).catch(err => {
    // console.error(err);
});