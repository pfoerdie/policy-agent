MATCH (action:Action { id: $id })

OPTIONAL MATCH  (action)-[:includedIn]->(includedIn:Action)
OPTIONAL MATCH  (action)-[:implies]->(implies:Action)

RETURN action.id AS id, 
       collect(includedIn.id) AS includedIn, 
       collect(implies.id) AS implies

UNION 

MATCH (:Action { id: $id })-[:includedIn|:implies*]->(action:Action)

OPTIONAL MATCH  (action)-[:includedIn]->(includedIn:Action)
OPTIONAL MATCH  (action)-[:implies]->(implies:Action)

RETURN action.id AS id, 
       collect(includedIn.id) AS includedIn, 
       collect(implies.id) AS implies