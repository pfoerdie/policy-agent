const
    Path = require('path'),
    Fs = require('fs'),
    { PAP } = require('../../PolicyAgent');

(async (/* #region MAIN */) => {

    let
        configPath = Path.join(__dirname, "pap-definition.json"),
        configBuffer = Fs.readFileSync(configPath),
        configJSON = JSON.parse(configBuffer.toString()),
        myPAP = new PAP({
            'host': "localhost",
            'port': "7687",
            'user': "neo4j",
            'password': "odrl"
        });

    await myPAP._request("MATCH (n) DETACH DELETE n");
    await myPAP._submitODRL(configJSON);

    // INFO configJSON might get changed, if the PAP fills any missing (and probably unnecessary) uids with generated uuids.
    // Fs.writeFileSync(Path.join(__dirname, "setup.inclUIDs.json"), JSON.stringify(configJSON, undefined, "\t"));

    process.exit();
})(/* #endregion MAIN */)
    .catch(console.error);