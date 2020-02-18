CREATE CONSTRAINT ON (action:Action) ASSERT action.id IS UNIQUE 
;
CREATE CONSTRAINT ON (entity:Entity) ASSERT entity.uid IS UNIQUE 
;
CREATE INDEX ON :Asset(uid) 
;
CREATE INDEX ON :Party(uid)