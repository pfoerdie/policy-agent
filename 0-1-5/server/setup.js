const
    Path = require('path'),
    Fs = require('fs'),
    PolicyAgent = require('..');

(async (/* #region MAIN */) => {

    let
        configTxt = Fs.readFileSync(Path.join(__dirname, "setup.json")),
        configJSON = JSON.parse(configTxt),
        myPAP = new PolicyAgent.PAP({
            password: "odrl"
        });

    await myPAP._request("MATCH (n) DETACH DELETE n");
    await myPAP._submitODRL(configJSON);

    // INFO configJSON might get changed, if the PAP fills any missing (and probably unnecessary) uids with generated uuids.
    // Fs.writeFileSync(Path.join(__dirname, "setup.inclUIDs.json"), JSON.stringify(configJSON, undefined, "\t"));

})(/* #endregion MAIN */)
    .catch(console.error);