const
    http = require('http'),
    express = require('express'),
    PolicyAgent = require('./index.js');

let
    app = express(),
    server = http.createServer(app);

PolicyAgent.PEP.init();

PolicyAgent.PEP.socketIO(server);
PolicyAgent.PEP.express(app, '/');

server.listen(80, () => {
    console.log("HTTP-Server listening!\n");
});


/**
 * https://socket.io/docs/
 * https://github.com/neo4j/neo4j-javascript-driver
 * https://github.com/bmeck/session-web-sockets
 * https://github.com/peerigon/socket.io-session-middleware
 * https://github.com/wcamarao/session.socket.io
 * http://usejsdoc.org/tags-type.html
 * http://usejsdoc.org/tags-param.html
 */