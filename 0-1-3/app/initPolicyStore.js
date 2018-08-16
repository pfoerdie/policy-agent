/**
 * Initial load of the policy store.
 * @author Simon Petrac
 */

const
    PolicyAgent = require('../index.js'),
    policyStore = new PolicyAgent.DataStore.Neo4j('localhost', 'neo4j', 'odrl'),
    PAP = new PolicyAgent.PAP(policyStore),
    setup = require('./data/setup.json');

/**
 * NOTE start neo4j
 * -> Ideapad
 * /d/Programme/Neo4j/neo4j-community-3.4.5/bin/neo4j.bat console
 * {@link http://localhost:7474/browser/ Neo4j Browser}
 */

PAP.loadODRL(setup).catch(console.error);