const
    PolicyAgent = require('..');

(async (/* #region MAIN */) => {

    let myPAP = new PolicyAgent.PAP({
        password: "odrl"
    });

    let
        actionID = "test_2",
        actionArr = await myPAP._request(
            [
                `MATCH path = (:ODRL:Action {id: "${actionID}"})-[:implies|includedIn*]->(:ODRL:Action)`,
                `UNWIND nodes(path) AS action WITH DISTINCT action`,
                `OPTIONAL MATCH (action)-[:includedIn]->(incl:ODRL:Action)`,
                `RETURN action.id AS id, incl.id AS includedIn, extract(impl IN (action)-[:implies]->(:ODRL:Action) | endNode(relationships(impl)[0]).id) AS implies`
            ].join("\n")
        ),
        actionMap = new Map(actionArr.map(elem => [elem.id, elem]));

    console.log(actionArr);
    console.log(await myPAP._request([
        `UNWIND $list AS actionID`,
        `MATCH (action:ODRL:Action {id: actionID})`,
        `RETURN action`
    ].join("\n"), { list: actionArr.map(elem => elem.id) }));

    return 0;

})(/* #endregion MAIN */)
    .catch(console.error);