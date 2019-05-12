const
    Path = require('path'),
    PolicyAgent = require("../PolicyAgent"),
    MongoDB = require('mongodb').MongoClient,
    Neo4j = require('neo4j-driver').v1,
    Util = require('util'),
    ChildProcess = require('child_process'),
    _exec = Util.promisify(ChildProcess.exec),
    _policyAgent = {},
    _promify = (fn, ...args) => new Promise((resolve, reject) => fn(...args, (err, result) => err ? reject(err) : resolve(result))),
    _pingDelay = .3e3; // 0.3s

function _startNeo4j() {
    let
        path_neo4j = Path.join(__dirname, "neo4j-community-3.5.5"),
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

function _startMongoDB() {
    let
        path_mongoDB = Path.join(__dirname, "mongodb-win32-x86_64-2008plus-ssl-4.0.9"),
        path_mongoDB_data = Path.join(__dirname, "mongodb-win32-x86_64-2008plus-ssl-4.0.9", "data/database"),
        cmd_startMongoDB = `cd "${path_mongoDB}" && start bin/mongod --dbpath="${path_mongoDB_data}"`;

    async function pingMongoDB() {
        let client = await _promify(MongoDB.connect, "mongodb://localhost:27017", { useNewUrlParser: true });
        client.close();
    }

    return new Promise((resolve, reject) => {
        pingMongoDB().then(resolve).catch(() => {
            let loop = setInterval(() => {
                pingMongoDB().then(() => {
                    clearInterval(loop);
                    resolve();
                }).catch(() => null);
            }, _pingDelay);
            _exec(cmd_startMongoDB).finally(() => {
                clearInterval(loop);
                console.warn('Neo4j closed');
                reject();
            });
        });
    });
} // _startMongoDB

async function _buildPolicyAgent() {
    _policyAgent.pip = new PolicyAgent.PIP({
        '@id': "information",
        'lost': "localhost",
        'port': "27017",
        'dbName': "InformationPoint"
    }); // _policyAgent.pip

    _policyAgent.pap = new PolicyAgent.PAP({
        '@id': "administration",
        'host': "localhost",
        'port': "7687",
        'user': "neo4j",
        'password': "odrl"
    }); // _policyAgent.pap

    _policyAgent.pdp = new PolicyAgent.PDP({
        '@id': "decision",
        'PIP': _policyAgent.pip,
        'PAP': _policyAgent.pap
    }); // _policyAgent.pdp

    _policyAgent.pep = new PolicyAgent.PEP({
        '@id': "enforcement",
        'PDP': _policyAgent.pdp
    }); // _policyAgent.pep

} // _buildPolicyAgent

async function _initialize() {
    let seconds = 0, loop = setInterval(() => console.log("... " + (++seconds)), 1e3);

    console.log("starting Neo4j and MongoDB ...");
    let readyNeo4j = _startNeo4j();
    let readyMongoDB = _startMongoDB();
    readyNeo4j.then(() => console.log("Neo4j running"));
    readyMongoDB.then(() => console.log("MongoDB running"));
    await Promise.all([readyNeo4j, readyMongoDB]);

    console.log("construct PolicyAgent");
    await _buildPolicyAgent();

    clearInterval(loop);
    console.log("... finished");
    return _policyAgent;
} // _initialize


let _ready = false;
let _readyPromise = _initialize();
_readyPromise.then(() => (_ready = true));
_readyPromise.catch(console.error);
exports.ready = (callback) => {
    if (callback) {
        if (_ready) callback(_policyAgent);
        else _readyPromise.then(() => callback(_policyAgent));
    }
    return _readyPromise;
};