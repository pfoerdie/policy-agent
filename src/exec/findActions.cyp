MATCH (action:Action { id: $id })
// WHERE action.temp IS NULL
RETURN action.id AS id