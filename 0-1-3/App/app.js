/**
 * Example Server App
 * @author Simon Petrac
 */

const
    HTTP = require('http'),
    Express = require('express'),
    SocketIO = require('socket.io'),
    PolicyAgent = require('../index.js');

let
    app = Express(),
    server = HTTP.createServer(app),
    io = SocketIO(server),
    myPEP, myPDP, myPIP, myPAP, policyStore, attributeStore;


//#region PolicyInformationPoint

attributeStore = new PolicyAgent.DataStore.MongoDB("localhost:27017", "AttributeStore");
/**
 * NOTE start mongodb -> examplePIPdataBase
 * ./mongodb/mongodb-community-4.0.0/bin/mongod --dbpath=D:/Dokumente/NodeJS/mongodb/server/examplePIPdataBase
 * ./mongodb/mongodb-compass-community-1.14.5/MongoDBCompassCommunity.exe
 */
attributeStore.ping().then(() => console.log(`examplePIPdataBase -> connected`)).catch(console.error);

myPIP = new PolicyAgent.PIP(attributeStore);

//#endregion PolicyInformationPoint

//#region PolicyDecisionPoint

policyStore = new PolicyAgent.DataStore.Neo4j('localhost', 'neo4j', 'odrl');
/**
 * NOTE start neo4j
 * -> admin-shell
 * /d/Dokumente/NodeJS/neo4j/neo4j-community-3.4.0/bin/neo4j.bat
 */
policyStore.ping().then(() => console.log(`examplePDPdataBase -> connected`)).catch(console.error);

myPDP = new PolicyAgent.PDP(policyStore);
myPDP.connectPIP(myPIP);

//#endregion PolicyDecisionPoint

//#region PolicyEnforcementPoint

myPEP = new PolicyAgent.PEP({
    cookieSecure: false
});

app.use(myPEP.expressRouter);
io.use(myPEP.socketIO);
myPEP.connectPDP(myPDP);

//#endregion PolicyEnforcementPoint

//#region PolicyAdministrationPoint

//#endregion PolicyAdministrationPoint

//#region PolicyExecutionPoint
//#endregion PolicyExecutionPoint

//#region Main

io.on('connection', (clientSocket) => {
    console.log(`client ${clientSocket.id} connected`);

    clientSocket.on('disconnect', () => {
        console.log(`client ${clientSocket.id} disconnected`);
    });
});

server.listen(80, () => console.log('HTTP-Server -> listening'));

//#endregion Main

return 0;

/**
 * NOTE The model operates by the following steps:
 *  1.  PAPs write policies and policy sets and make them available to the PDP.  
 *      These policies or policy sets represent the complete policy for a specified target.
 *  2.  The access requester sends a request for access to the PEP.
 *  3.  The PEP sends the request for access to the context handler in its native request format, 
 *      optionally including attributes of the subjects, resource, action, environment and other categories.
 *  4.  The context handler constructs an XACML request context, 
 *      optionally adds attributes, and sends it to the PDP.
 *  5.  The PDP requests any additional subject, resource, action, environment 
 *      and other categories (not shown) attributes from the context handler.
 *  6.  The context handler requests the attributes from a PIP.
 *  7.  The PIP obtains the requested attributes.
 *  8.  The PIP returns the requested attributes to the context handler.
 *  9.  Optionally, the context handler includes the resource in the context.
 *  10. The context handler sends the requested attributes and (optionally) the resource to the PDP.  
 *      The PDP evaluates the policy.
 *  11. The PDP returns the response context (including the authorization decision) to the context handler.
 *  12. The context handler translates the response context to the native response format of the PEP. 
 *      The context handler returns the response to the PEP.
 *  13. The PEP fulfills the obligations.
 *  14. (Not shown) If access is permitted, then the PEP permits access to the resource; otherwise, it denies access.
 * {@link http://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html#_Toc325047088 XACML Data-flow model}
 */