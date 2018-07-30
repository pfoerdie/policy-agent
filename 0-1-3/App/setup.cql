// uid must be unique for all :ODRL nodes
CREATE CONSTRAINT ON (n:ODRL) ASSERT n.uid IS UNIQUE

// id must be unique for all :Action nodes
CREATE CONSTRAINT ON (n:Action) ASSERT n.id IS UNIQUE

;

MATCH (n) DETACH DELETE n

;

// create some starter elements
CREATE (:ODRL:Policy {uid: "/policy/access", label: "Policy"})
CREATE (:ODRL:Party {uid: "/party/pfoerdie", label: "Pfoerdie"})
CREATE (:ODRL:Asset {uid: "/asset/index.html", label: "Home"})
CREATE (:ODRL:Asset {uid: "/asset/marzipan", label: "Marzipan"})
CREATE (:ODRL:Action {id: "use", label: "use"})
CREATE (:ODRL:Action {id: "read", label: "read"})

;

// connect the actions
MATCH (action_use:ODRL:Action {id: "use"})
MATCH (action_read:ODRL:Action {id: "read"})

MERGE (action_read)-[:includedIn]->(action_use)

;

// connect the index.html
MATCH (policy:ODRL:Policy {uid: "/policy/access"})
MATCH (asset:ODRL:Asset {uid: "/asset/index.html"})
MATCH (user:ODRL:Party {uid: "/party/pfoerdie"})
MATCH (action:ODRL:Action {id: "read"})

// with basic read action
CREATE (rule:ODRL:Rule:Permission {label: "Rule"})

MERGE (policy)-[:permission]->(rule)
MERGE (rule)-[:target]->(asset)
MERGE (rule)-[:assignee]->(user)
MERGE (rule)-[:action]->(action)

;

// connect marzipan
MATCH (policy:ODRL:Policy {uid: "/policy/access"})
MATCH (asset:ODRL:Asset {uid: "/asset/marzipan"})
MATCH (user:ODRL:Party {uid: "/party/pfoerdie"})
MATCH (action:ODRL:Action {id: "use"})

// this action has a refinement, so it needs a dummy node -> special notation like in JSON
CREATE (rule:ODRL:Rule:Permission {label: "Rule"})
CREATE (refinedAction:ODRL:Action {label: "Action"})
CREATE (refinement:ODRL:Constraint {uid: "/constraint/example", label: "Constraint"})

MERGE (policy)-[:permission]->(rule)
MERGE (rule)-[:target]->(asset)
MERGE (rule)-[:assignee]->(user)
MERGE (rule)-[:action]->(refinedAction)
MERGE (refinedAction)-[:value]->(action)
MERGE (refinedAction)-[:refinement]->(refinement)

;

MATCH (n) RETURN n