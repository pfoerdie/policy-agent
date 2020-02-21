MATCH (target:Entity:Asset { uid: $target })

WITH target
UNWIND $actions AS actionID
MATCH (action:Action { id: actionID })

// TODO optional assignee/assigner

WITH action, target
MATCH (policy:Entity:Policy)
MATCH (policy)-[:permission]->(rule:Rule)
WHERE (rule)-[:target]->(target)
  AND (rule)-[:action]->(action)

WITH policy, rule
OPTIONAL MATCH (rule)-[:constraint]->(constraint:Constraint)
OPTIONAL MATCH (constraint)-[:leftOperand]->(leftOperand:Operand)
OPTIONAL MATCH (constraint)-[:rightOperand]->(rightOperand:Operand)

RETURN policy, rule, constraint, leftOperand, rightOperand
// RETURN properties(policy) AS policy, extract(rule IN rules | properties(rule)) AS rules

// TODO just basic so far