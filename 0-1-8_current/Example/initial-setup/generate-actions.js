const
    Path = require('path'),
    Fs = require('fs');

(async (/* #region MAIN */) => {

    let
        topLevelActions = ['use', 'transfer'],
        configPath = Path.join(__dirname, "pap-definition.json"),
        outputPath = Path.join(__dirname, "defineActions.js"),
        configBuffer = Fs.readFileSync(configPath),
        configJSON = JSON.parse(configBuffer.toString()),
        actionArr = configJSON['@graph'].filter(elem => elem['@type'] === "Action" && !topLevelActions.includes(elem.id)),
        outputActions = [],
        sortedActions = new Set(topLevelActions);

    for (let i = 0, max = actionArr.length; i < max; undefined) {
        let action = actionArr[i];
        if (sortedActions.has(action.includedIn) && (action.implies || []).every(elem => sortedActions.has(elem))) {
            i++;
            sortedActions.add(action.id);
        } else {
            actionArr.splice(i, 1);
            actionArr.push(action);
        }
    }

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