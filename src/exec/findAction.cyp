// NOTE The order of the two queries ensures, that if anything was found, 
//      the first record would always be the one searched for and
//      the others would be any from the includedIn/implies chain.

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