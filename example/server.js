const
    PolicyAgent = require(".."),
    Http = require("http"),
    Express = require("express"),
    ExpressSession = require("express-session"),
    SocketIO = require("socket.io");

// console.log(PolicyAgent);

const
    app = Express(),
    server = Http.createServer(app),
    io = SocketIO(server),
    sessions = ExpressSession({
        secret: "lorem_ipsum",
        saveUninitialized: true,
        resave: false,
        secure: false
    }),
    port = 80;

PolicyAgent.repo.connect("localhost", "neo4j", "odrl");
// PolicyAgent.repo.ping().then(console.log).catch(console.error);
// PolicyAgent.exec.register(PolicyAgent.admin.login);
// PolicyAgent.admin.login();


// io.on("connection", function (socket) {
//     const socketID = socket.id;
//     console.log("Socket<" + socketID + "> connected");

//     socket.on("disconnect", function () {
//         console.log("Socket<" + socketID + "> disconnected");
//     });
// });

// app.use(function (request, response, next) {
//     console.log("Request<" + request.url + "> arrived");
//     next();
// });

io.use((request, next) => sessions(request.request, request.request.res, (err) => err ? next(err) : PolicyAgent.enforce(request.request, request.request.res, next)));
app.use(sessions, PolicyAgent.enforce, Express.static(__dirname));

server.listen(port, () => console.log("running at http://localhost:" + port));

