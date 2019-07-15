MATCH (n)
DETACH DELETE n
;

CREATE CONSTRAINT ON (entity:ODRL) ASSERT entity.uid IS UNIQUE
CREATE CONSTRAINT ON (action:ODRL:Action) ASSERT action.id IS UNIQUE
;

CREATE (:ODRL:Action { id: "use" })
CREATE (:ODRL:Action { id: "transfer" })
;

CREATE (:ODRL:AssetCollection { uid: "Assets" })
CREATE (:ODRL:PartyCollection { uid: "Parties" })
;