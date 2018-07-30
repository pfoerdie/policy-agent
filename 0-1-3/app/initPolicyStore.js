/**
 * Initial load of the policy store.
 * @author Simon Petrac
 */

const
    fs = require('http'),
    PolicyAgent = require('../index.js'),
    policyStore = new PolicyAgent.DataStore.Neo4j('localhost', 'neo4j', 'odrl'),
    PAP = new PolicyAgent.PAP(policyStore),
    setup = require('./data/setup.json');

PAP.loadODRL(setup).catch(console.error);