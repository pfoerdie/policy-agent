/**
 * @module PolicyAgent~SystemComponent
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    Context = require(Path.join(__dirname, "Context.js")),
    DataStore = require(Path.join(__dirname, "DataStore.js"));

(async (/* TESTING */) => {

    const attributeStore = new DataStore.MongoDB(undefined, 'AttributeStore');
    const policyStore = new DataStore.Neo4j(undefined, undefined, 'odrl');

    return 0;
    // NOTE was cooleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeees

})(/* TESTING */).then(console.log).catch(console.error);


