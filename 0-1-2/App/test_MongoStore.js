const
    PolicyAgent = require('../index.js');

(async (/* main */) => {

    let mongoStore = new PolicyAgent.DataStore.MongoDB("localhost:27017", "AttributeStore");
    let pingResult = await mongoStore.ping();

    console.log('ping:', pingResult);

    let retrieveResult = await mongoStore.retrieve(
        {
            '@type': "Party",
            'username': "pfoerdie"
        }, {
            '@type': "Asset",
            '@id': "marzipan-asset-id"
        }
    );

    console.log('retrieved:', retrieveResult);

})(/* main */).catch(console.error);


