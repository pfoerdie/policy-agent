const
    PolicyAgent = require('..'),
    MongoStore = PolicyAgent.DataStore.MongoDB,
    Neo4jStore = PolicyAgent.DataStore.Neo4j,
    PIP = PolicyAgent.PIP,
    PDP = PolicyAgent.PDP,
    PEP = PolicyAgent.PEP,
    PAP = PolicyAgent.PAP;


(async (/* TESTING */) => {

    const
        attributeStore = new MongoStore(undefined, 'AttributeStore'),
        policyStore = new Neo4jStore(undefined, undefined, 'odrl'),
        myPIP = new PIP(attributeStore),
        myPDP = new PDP(policyStore),
        myPEP = new PEP(),
        myPAP = new PAP(policyStore);

    return 0;
    // NOTE was cooleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeees

})(/* TESTING */).then(result => {
    // console.log(result);
}).catch(err => {
    // console.error(err);
});