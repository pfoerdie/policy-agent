const { PRP } = require("../PolicyAgent");

module.exports = (async (/* async closure */) => {

    await require("./init.js");

    PRP.connect("localhost", "neo4j", "odrl");
    await PRP.wipeData(true);

    await Promise.all([
        PRP.defineAction('use', null, []),
        PRP.defineAction('transfer', null, []),
        PRP.defineAction('read', 'use', ['test']),
        PRP.defineAction('sendFile', 'use', ['read']),
        PRP.defineAction('login', 'use', ['transfer']),
        PRP.defineAction('test', 'transfer', []),
    ]);

    let tmp = await PRP._createAsset({
        type: "File",
        uid: "hello_world",
        path: "/hello_world.txt"
    });
    console.log(tmp);

})(/* async closure */);