/**
 * INFO tests/PDP#_requestDecision
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    PolicyAgent = require('..'),
    Context = require('../core/Context.js');

const
    myPIP = new PolicyAgent.PIP(),
    myPAP = new PolicyAgent.PAP({
        password: "odrl"
    }),
    session = {
        id: UUID()
    },
    requestContext = new Context.Request(session, {
        'action': "test_2",
        'target': {
            '@type': "content",
            '@id': "/login"
        }
    });

(async (/* #region MAIN */) => {

    await myPIP._retrieveSubjects(requestContext.subjects);

    let
        responseContext = new Context.Response(requestContext),
        /** @type {Map<string, PolicyAgent.Action} */
        actionMap = new Map(),
        /** @type {Map<PolicyAgent.Action, object} */
        recordsMap = new Map();

    try {
        let
            actionQuery = [
                // find every related action ...
                `MATCH path = (:ODRL:Action {id: $action})-[:implies|includedIn*]->(:ODRL:Action)`,
                `UNWIND nodes(path) AS action WITH DISTINCT action`,
                `OPTIONAL MATCH (action)-[:includedIn]->(incl:ODRL:Action)`,
                // ... and return them incl. includedIn/implies
                `RETURN`,
                `action.id AS id,`,
                `incl.id AS includedIn,`,
                `extract(impl IN (action)-[:implies]->(:ODRL:Action) | endNode(relationships(impl)[0]).id) AS implies`
            ].join("\n"),
            actionArr = await myPAP._request(actionQuery, { 'action': requestContext.action['@id'] }),
            subjects = requestContext.subjects,
            subjectsQuery = [
                `UNWIND $actionList AS actionID`,
                // find the action and the target
                `MATCH (action:ODRL:Action {id: actionID})`,
                `MATCH (target:ODRL:Asset {uid: $target})`,
                // if assignee or assigner are present, find them too
                subjects.assignee ? `MATCH (assignee:ODRL:Party {uid: $assignee})` : undefined,
                subjects.assigner ? `MATCH (assigner:ODRL:Party {uid: $assigner})` : undefined,
                // search for every policy, that is related to that target and action
                `MATCH (policy:ODRL:Policy)-[ruleType:permission|:obligation|:prohibition]->(rule:ODRL:Rule)`,
                `WHERE ( (rule)-[:target]->(target) OR (rule)-[:target]->(:ODRL:AssetCollection)<-[:partOf*]-(target) )`,
                `AND ( (rule)-[:action]->(action) OR (rule)-[:action]->(:ODRL:Action)-[:value]->(action) )`,
                // filter further with by assignee reference ...
                subjects.assignee
                    ? `AND ( (rule)-[:assignee]->(assignee) OR (rule)-[:assignee]->(:ODRL:PartyCollection)<-[*:partOf]-(assignee) OR NOT (rule)-[:assignee]->(:ODRL) )`
                    : `AND NOT (rule)-[:assignee]->(:ODRL)`,
                // ... and assigner reference
                subjects.assigner
                    ? `AND ( (rule)-[:assigner]->(assigner) OR (rule)-[:assigner]->(:ODRL:PartyCollection)<-[*:partOf]-(assigner) OR NOT (rule)-[:assigner]->(:ODRL) )`
                    : `AND NOT (rule)-[:assigner]->(:ODRL)`,
                // TODO constraints, conflict etc.
                // return collected results
                `RETURN actionID, policy.uid AS policy, rule.uid AS rule, type(ruleType) AS ruleType`
            ].filter(elem => elem).join("\n"),
            recordsArr = await myPAP._request(subjectsQuery, {
                // parameter for the query
                'actionList': actionArr.map(action => action.id),
                'target': `/${subjects.target['@type']}${subjects.target['@id']}`,
                'assignee': subjects.assignee ? `/${subjects.assignee['@type']}${subjects.assignee['@id']}` : undefined,
                'assigner': subjects.assigner ? `/${subjects.assigner['@type']}${subjects.assigner['@id']}` : undefined
            });

        actionArr.forEach(action => actionMap.set(action.id, new Action(action.id)));

        for (let action of actionArr) {
            // add actions to a Map for easy access
            let action = new Action();
            actionMap.set(action.id, action);
            recordsMap.set(actionMap.get(action.id), []);
        }

        for (let record of recordsArr) {
            // push each record to the corresponding action
            recordsMap.get(record['actionID']).push(record);
        }

        return responseContext;

    } catch (err) {
        responseContext.decision = "NotApplicable";
        return responseContext;
    }

    /**
     * INFO {@link https://www.w3.org/TR/odrl-model/#conflict Policy Conflict Strategy}
     * The conflict property SHOULD take one of the following Conflict Strategy Preference values (instance of the ConflictTerm class):
     *      perm: the Permissions MUST override the Prohibitions
     *      prohibit: the Prohibitions MUST override the Permissions
     *      invalid: the entire Policy MUST be void if any conflict is detected
     * 
     * If the conflict property is not explicitly set, the default of invalid will be used.
     * 
     * The Conflict Strategy requirements include:
     *      If a Policy has the conflict property of perm then any conflicting Permission Rule MUST override the Prohibition Rule.
     *      If a Policy has the conflict property of prohibit then any conflicting Prohibition Rule MUST override the Permission Rule.
     *      If a Policy has the conflict property of invalid then any conflicting Rules MUST void the entire Policy.
     * 
     * INFO 7.17 Authorization decision:
     *   -> The PDP MUST return a response context, with one <Decision> element of value "Permit", "Deny", "Indeterminate" or "NotApplicable".
     * 
     * IDEA Aufteilung in: Indeterminate | Permission | Prohibition | Obligation | NotApplicable
     * TODO Unterscheidung von Set/Offer/Aggreement Policies
     */

    function validatePolicy(record) {

    } // validatePolicy

    function validateAction(action) {
        // NOTE I decided to go for a prohibit-PDP by default, as long as ConflictTerm is not validated

    } // validateAction

    // TODO

    return 0;

})(/* #endregion MAIN */).catch((err) => {
    return err;
});