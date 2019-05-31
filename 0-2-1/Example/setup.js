const
    Path = require('path'),
    Neo4j = require('neo4j-driver').v1,
    Util = require('util'),
    ChildProcess = require('child_process'),
    _exec = Util.promisify(ChildProcess.exec),
    _pingDelay = .9e3;

function _startNeo4j() {
    let
        path_neo4j = Path.join(__dirname, "../neo4j-community-3.5.6"),
        cmd_startNeo4j = `cd "${path_neo4j}" && cd bin && start neo4j.bat console`,
        driver = Neo4j.driver(
            `bolt://localhost:7687`,
            Neo4j.auth.basic("neo4j", "odrl")
        );

    async function pingNeo4j() {
        let
            session = driver.session(),
            result = await session.run("RETURN NULL");

        session.close();
    }

    return new Promise((resolve, reject) => {
        pingNeo4j().then(resolve).catch(() => {
            let loop = setInterval(() => {
                pingNeo4j().then(() => {
                    clearInterval(loop);
                    resolve();
                }).catch(() => null);
            }, _pingDelay);
            _exec(cmd_startNeo4j).finally(() => {
                clearInterval(loop);
                console.warn('Neo4j closed');
                reject();
            });
        });
    });
} // _startNeo4j

async function _initialize() {
    let seconds = 0, loop = setInterval(() => console.log("... " + (++seconds)), 1e3);

    console.log("starting Neo4j ...");

    try {
        await _startNeo4j();
        clearInterval(loop);
        console.log("... finished\n");
    } catch (err) {
        clearInterval(loop);
        throw err;
    }
} // _initialize


let _readyPromise = _initialize();
_readyPromise.catch(console.error);
module.exports = _readyPromise;