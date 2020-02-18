// NOTE Changing the first MERGE to CREATE and the others to MATCH, 
//      will be a more strikt approach, were you also cannot overwrite actions.
//      Though for development it is convenient to just overwrite them.

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