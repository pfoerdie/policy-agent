const
    Path = require('path'),
    Neo4j = require('neo4j-driver').v1,
    Util = require('util'),
    ChildProcess = require('child_process'),
    _exec = Util.promisify(ChildProcess.exec),
    _pingDelay = .9e3,
    _neo4jPath = Path.join(__dirname, "../neo4j-community-3.5.6");

module.exports = (async () => {
    let
        startNeo4j = `cd "${Path.join(_neo4jPath, "bin")}" && start neo4j.bat console`,
        driver = Neo4j.driver(
            `bolt://localhost:7687`,
            Neo4j.auth.basic("neo4j", "odrl")
        );

    function startCounter() {
        let seconds = 0;
        console.log("starting Neo4j ...");
        return setInterval(() => console.log("... " + (++seconds)), 1e3);
    } // startCounter

    async function pingNeo4j() {
        // throw "don't ping";
        let session = driver.session();
        await session.run("RETURN NULL");
        session.close();
    }

    return new Promise((resolve, reject) => {
        pingNeo4j().then(resolve).catch(() => {
            let counter = startCounter();
            let loop = setInterval(() => {
                pingNeo4j().then(() => {
                    clearInterval(counter);
                    clearInterval(loop);
                    resolve();
                }).catch(() => null);
            }, _pingDelay);
            _exec(startNeo4j).finally(() => {
                clearInterval(counter);
                clearInterval(loop);
                reject("Neo4j closed");
            });
        });
    });
})();