MATCH (target:Entity:Asset { uid: $target.uid })

WITH target
UNWIND $actions AS _action
MATCH (action:Action { id: $_action.id })

WITH action, target
MATCH (policy:Entity:Policy:Set)
MATCH (policy)-[:permission]->(rule:Rule)
WHERE (rule)-[:target]->(target)
  AND (rule)-[:action]->(action)

WITH target, action, policy, collect(rule) AS rules
RETURN policy, rules

// TODO just basic so far