CREATE CONSTRAINT ON (action:Action) ASSERT action.id IS UNIQUE ;

CREATE CONSTRAINT ON (entity:Entity) ASSERT entity.uid IS UNIQUE ;
CREATE INDEX ON :Entity(type) ;
// CREATE CONSTRAINT ON (entity:Entity) ASSERT exists(entity.uid) ;
// CREATE CONSTRAINT ON (entity:Entity) ASSERT exists(entity.type) ;

CREATE INDEX ON :Party(username) ;

// CREATE INDEX ON :Asset(uid) ;
// CREATE INDEX ON :Asset(type) ;
// CREATE INDEX ON :Party(uid) ;
// CREATE INDEX ON :Party(type) ;