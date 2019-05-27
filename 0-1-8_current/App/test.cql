WITH {} AS result

// FOREACH (entry IN $entries |
UNWIND $entries AS entry

    MATCH (action:ODRL:Action {id: entry.action})
    MATCH (target:ODRL:Asset {uid: entry.target})
    OPTIONAL MATCH (assignee:ODRL:Party {uid: entry.assignee})
    OPTIONAL MATCH (assigner:ODRL:Party {uid: entry.assigner})

    WITH entry.id AS entryID, action, target, assignee, assigner
    MATCH path = (policy:ODRL:Policy)-[ruleRel:permission|:obligation|:prohibition]->(rule:ODRL:Rule)
    WHERE ( (rule)-[:target]->(target) OR (rule)-[:target]->(:ODRL:AssetCollection)<-[:partOf*]-(target) )
    AND ( (rule)-[:action]->(action) OR (rule)-[:action]->(:ODRL:Action)-[:value]->(action) )
    AND ( NOT (rule)-[:assignee]->(:ODRL) OR (rule)-[:assignee]->(assignee) OR (rule)-[:assignee]->(:ODRL:PartyCollection)<-[:partOf*]-(assignee) )
    AND ( NOT (rule)-[:assigner]->(:ODRL) OR (rule)-[:assigner]->(assigner) OR (rule)-[:assigner]->(:ODRL:PartyCollection)<-[:partOf*]-(assigner) )

    WITH {id: entryID, policy: policy.uid, rule: rule.uid, ruleType: type(ruleRel)} AS tmpResult
    SET result[entryID] = coalesce(result[entryID], []) + tmpResult

// )
RETURN result