const
    ODRL = require("../PolicyAgent/ODRL4j.js"),
    Neo4j = require('neo4j-driver').v1,
    driver = Neo4j.driver("bolt://localhost", Neo4j.auth.basic("neo4j", "odrl"));

console.log(null);