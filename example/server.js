const
    PolicyAgent = require(".."),
    Http = require("http"),
    Express = require("express");

console.log(PolicyAgent);

const
    app = Express(),
    server = Http.createServer(app),
    port = 80;

// PolicyAgent.repo.connect();
// PolicyAgent.admin.login();

app.use(PolicyAgent.enforce(/* PARAM */));
app.use(Express.static(__dirname));

server.listen(port, () => console.log("running at http://localhost:" + port));