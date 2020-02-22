// Find the target and optionally the assignee and assigner.
MATCH (target:Entity:Asset { uid: $target })
OPTIONAL MATCH (assignee:Entity:Party {uid: $assignee})
OPTIONAL MATCH (assigner:Entity:Party {uid: $assigner})

// Now find all actions for the context.
WITH target, assignee, assigner
UNWIND $actions AS actionID
MATCH (action:Action { id: actionID })

// With the key nodes gathered, the policies, rules and constraints can be found.
WITH action, target, assignee, assigner
MATCH (policy:Entity:Policy)-[rel:permission|:prohibition]->(rule:Rule)
// The condition looks kinda crazy, but it just checks, if a policy and some of its rules 
// have a relation to the found ressources, actions and subjects.
WHERE (rule)-[:action]->(action)
    // AND ((rule)-[:target]->(target) 
    //     OR (NOT (rule)-[:target]->(:Entity) 
    //         AND (policy)-[:target]->(target)))
    AND ((NOT (rule)-[:target]->(:Entity) 
            AND ((policy)-[:target]->(target)
                OR (policy)-[:target]->(:AssetCollection)<-[:partOf*]-(target)))
        OR (rule)-[:target]->(target) 
        OR (rule)-[:target]->(:AssetCollection)<-[:partOf*]-(target) )
    AND ((NOT (rule)-[:assignee]->(:Entity) 
            AND (NOT (policy)-[:assignee]->(:Entity)
                OR (policy)-[:assignee]->(assignee)
                OR (policy)-[:assignee]->(:PartyCollection)<-[:partOf*]-(assignee)))
        OR (rule)-[:assignee]->(assignee) 
        OR (rule)-[:assignee]->(:PartyCollection)<-[:partOf*]-(assignee) )
    AND ((NOT (rule)-[:assigner]->(:Entity) 
            AND (NOT (policy)-[:assigner]->(:Entity)
                OR (policy)-[:assigner]->(assigner)
                OR (policy)-[:assigner]->(:PartyCollection)<-[:partOf*]-(assigner)))
        OR (rule)-[:assigner]->(assigner) 
        OR (rule)-[:assigner]->(:PartyCollection)<-[:partOf*]-(assigner) )

// Also the constraints for the rules can be found.
WITH policy, rule, rel
OPTIONAL MATCH (rule)-[:constraint]->(constraint:Constraint)
OPTIONAL MATCH (constraint)-[:leftOperand]->(leftOperand:Operand)
OPTIONAL MATCH (constraint)-[:rightOperand]->(rightOperand:Operand)

// The next steps reduce the result.
WITH policy, rule, rel, 
    properties(constraint) AS constraint, 
    properties(leftOperand) AS leftOperand, 
    properties(rightOperand) AS rightOperand

// First collect the constraints of the rules.
WITH policy, type(rel) AS type, 
    properties(rule) AS rule, 
    collect({ 
        constraint: constraint, 
        leftOperand: leftOperand, 
        rightOperand: rightOperand 
    }) AS constraints

// Then collect the rules of the policies.
WITH properties(policy) AS policy, 
    collect({ 
        type: type, 
        rule: rule, 
        constraints: CASE 
            WHEN constraints[0].constraint IS NULL 
            THEN null ELSE constraints 
        END
    }) AS rules

// At last return the different policies with its respective rules.
RETURN DISTINCT policy, rules