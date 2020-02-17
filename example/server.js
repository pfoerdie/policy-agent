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

(async (/* async iife */) => {

    PolicyAgent.repo.connect("localhost", "neo4j", "odrl");
    console.log(await PolicyAgent.repo.ping());

    await PolicyAgent.exec.register("read", "use");
    await PolicyAgent.exec.register("http:GET", "read");
    await PolicyAgent.exec.register("hello_world", "use", ["read", "lorem_ipsum"]);

    PolicyAgent.exec.define("read", function (...args) {
        console.log(`read.call(${this}, ${args.join(", ")})`);
    });

})(/* async iife */).catch(err => null);

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

