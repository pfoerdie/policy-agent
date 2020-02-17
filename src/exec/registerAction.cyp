MERGE (action:Action { id: $id })

WITH action
OPTIONAL MATCH (action)-[rel:includedIn|:implies]->(:Action)
DELETE rel

WITH DISTINCT action
MERGE (target:Action { id: $includedIn })
CREATE (action)-[:includedIn]->(target)

WITH action
FOREACH(targetID IN $implies |
    MERGE (target:Action { id: targetID })
    CREATE (action)-[:implies]->(target)
)

RETURN action.id AS id