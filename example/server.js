const
    PolicyAgent = require(".."),
    Http = require("http"),
    Express = require("express"),
    ExpressSession = require("express-session"),
    SocketIO = require("socket.io");

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
PolicyAgent.repo.ping().then(console.log).catch((err) => null);
PolicyAgent.exec.register(PolicyAgent.admin.login);
// PolicyAgent.admin.login();

app.use(function (request, response, next) {
    console.log(request.method, request.url);
    next();
});

app.use(sessions);
app.use(PolicyAgent.enforce.express);
app.use(Express.static(__dirname));

// io.use(function (request, next) {
//     console.log(request.request.method, request.request.url);
//     next();
// });

// io.use((request, next) => sessions(request.request, request.request.res, next));
// io.use(PolicyAgent.enforce.io);

server.listen(port, () => console.log(`running at http://localhost:${port}`));

