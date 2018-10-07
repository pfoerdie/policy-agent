// uid must be unique for all :ODRL nodes
CREATE CONSTRAINT ON (n:ODRL) ASSERT n.uid IS UNIQUE

;

// id must be unique for all :Action nodes
CREATE CONSTRAINT ON (n:Action) ASSERT n.id IS UNIQUE

;