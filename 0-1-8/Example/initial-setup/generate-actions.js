const
    Path = require('path'),
    Fs = require('fs');

(async (/* #region MAIN */) => {

    let
        configPath = Path.join(__dirname, "pap-definition.json"),
        outputPath = Path.join(__dirname, "defineActions.js"),
        configBuffer = Fs.readFileSync(configPath),
        configJSON = JSON.parse(configBuffer.toString()),
        actionArr = configJSON['@graph'].filter(elem => elem['@type'] === "Action" && (elem.id !== 'use' && elem.id !== 'transfer')),
        outputActions = [];

    for (let action of actionArr) {
        let actionStr = `\tpep.defineAction(`
            + `\n\t\t"${action.id}",`
            + `\n\t\tfunction (session, response) {\n\t\t\t// TODO \n\t\t},`
            + `\n\t\t"${action.includedIn}",`
            + ` [${!action.implies ? "" : action.implies.map(val => `"${val}"`).join(", ")}],`
            + `\n\t); // ${action.id}`;
        outputActions.push(actionStr);
    }

    let outputStr = `module.exports = function(pep) {`
        + `\n\n` + outputActions.join("\n\n")
        + `\n\n}; // module.exports`;
    Fs.writeFileSync(outputPath, outputStr);

})(/* #endregion MAIN */)
    .catch(console.error);