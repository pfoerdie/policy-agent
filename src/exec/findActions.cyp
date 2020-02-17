MATCH (action:Action { id: $id })
RETURN action.id AS id

// MATCH (action:Action {id: $id})
//     WHERE NOT action.temp
//     OPTIONAL MATCH (action)-[rel:includedIn|:implies]->(target:Action)
//     WHERE NOT target.temp
//     RETURN [action.id, type(rel), target.id] AS result
// UNION
// MATCH (source:Action {id: $id})-[refs:includedIn|:implies*]->(action:Action)
//     WHERE NOT source.temp AND NOT action.temp
//     OPTIONAL MATCH (action)-[ref:includedIn|:implies]->(target:Action)
//     WHERE NOT target.temp
//     RETURN [action.id, type(ref), target.id] AS result