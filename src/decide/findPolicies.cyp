MATCH (target:Entity:Asset { uid: $target })

WITH target
UNWIND $actions AS actionID
MATCH (action:Action { id: actionID })

// TODO optional assignee/assigner

WITH action, target
MATCH (policy:Entity:Policy)
MATCH (policy)-[rel:permission|:prohibition|:obligation]->(rule:Rule)
WHERE (rule)-[:target]->(target)
  AND (rule)-[:action]->(action)

// TODO differ rules in Permission, Duty and Prohibition
// TODO apply different relations (failure, duty, remedy, consequence)
// TODO maybe: inheritFrom Policy

WITH policy, rule, rel
OPTIONAL MATCH (rule)-[:constraint]->(constraint:Constraint)
OPTIONAL MATCH (constraint)-[:leftOperand]->(leftOperand:Operand)
OPTIONAL MATCH (constraint)-[:rightOperand]->(rightOperand:Operand)

WITH policy, rule, rel, 
  properties(constraint) AS constraint, 
  properties(leftOperand) AS leftOperand, 
  properties(rightOperand) AS rightOperand

WITH policy, 
  type(rel) AS type, 
  properties(rule) AS rule, 
  collect({ constraint:constraint, leftOperand:leftOperand, rightOperand:rightOperand }) AS constraints

WITH 
  properties(policy) AS policy, 
  collect({ type:type, rule:rule, constraints:constraints }) AS rules

RETURN DISTINCT policy, rules

// TODO maybe a good method. needs testing. 