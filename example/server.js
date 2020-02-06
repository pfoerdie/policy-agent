const
    PolicyAgent = require(".."),
    Http = require("http"),
    Express = require("express");

const
    app = Express(),
    server = Http.createServer(app),
    port = 80;

app.use(PolicyAgent.enforce(/* PARAM */));
app.use(Express.static(__dirname));

server.listen(port, () => console.log("running at http://localhost:" + port));