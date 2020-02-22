MATCH (target:Entity:Asset { uid: $target })
OPTIONAL MATCH (assignee:Entity:Party {uid: $assignee})
OPTIONAL MATCH (assigner:Entity:Party {uid: $assigner})

WITH target, assignee, assigner
UNWIND $actions AS actionID
MATCH (action:Action { id: actionID })

WITH action, target, assignee, assigner
MATCH (policy:Entity:Policy)-[rel:permission|:prohibition|:obligation]->(rule:Rule)
WHERE (rule)-[:target]->(target)
    AND (rule)-[:action]->(action)
    AND (NOT (rule)-[:assignee]->(:Entity) 
        OR (rule)-[:assignee]->(assignee) 
        OR (rule)-[:assignee]->(:PartyCollection)<-[:partOf*]-(assignee) )
    AND (NOT (rule)-[:assigner]->(:Entity) 
        OR (rule)-[:assigner]->(assigner) 
        OR (rule)-[:assigner]->(:PartyCollection)<-[:partOf*]-(assigner) )

// TODO differ rules in Permission, Duty and Prohibition
// TODO apply different relations (failure, duty, remedy, consequence)
// TODO maybe: inheritFrom Policy

WITH policy, rule, rel
OPTIONAL MATCH (rule)-[:constraint]->(constraint:Constraint)
OPTIONAL MATCH (constraint)-[:leftOperand]->(leftOperand:Operand)
OPTIONAL MATCH (constraint)-[:rightOperand]->(rightOperand:Operand)

WITH 
    policy, rule, rel, 
    properties(constraint) AS constraint, 
    properties(leftOperand) AS leftOperand, 
    properties(rightOperand) AS rightOperand

WITH 
    policy, 
    type(rel) AS type, 
    properties(rule) AS rule, 
    collect({ 
        constraint:constraint, 
        leftOperand:leftOperand, 
        rightOperand:rightOperand 
    }) AS constraints

WITH 
    properties(policy) AS policy, 
    collect({ 
        type:type, 
        rule:rule, 
        constraints: CASE 
            WHEN constraints[0].constraint IS NULL 
            THEN null ELSE constraints 
        END
    }) AS rules

RETURN DISTINCT policy, rules

// TODO maybe a good method. needs testing. 