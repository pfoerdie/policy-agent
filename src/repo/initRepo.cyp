// MATCH (n)
// DETACH DELETE n
// ;

CREATE CONSTRAINT ON (action:Action) 
ASSERT action.id IS UNIQUE
;

CREATE CONSTRAINT ON (entity:Entity) 
ASSERT entity.uid IS UNIQUE
;

MERGE (:Action, {id: "use"})
MERGE (:Action, {id: "transfer"})
;

