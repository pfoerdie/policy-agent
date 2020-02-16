MERGE (action:Action { id: $id })
REMOVE action.temp

WITH action
OPTIONAL MATCH (action)-[rel:includedIn]->(:Action)
DELETE rel

WITH DISTINCT action
OPTIONAL MATCH (action)-[rel:implies]->(:Action)
DELETE rel

WITH DISTINCT action
MERGE (target:Action { id: $includedIn })
ON CREATE SET target.temp = true
CREATE (action)-[:includedIn]->(target)

WITH action
FOREACH(targetID IN $implies |
    MERGE (target:Action { id: targetID })
    ON CREATE SET target.temp = true
    CREATE (action)-[:implies]->(target)
)

RETURN action.id AS id