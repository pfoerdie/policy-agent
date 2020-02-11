const { PRP, PIP, PAP, PDP, PXP, PEP } = require("../PolicyAgent");


(async (/* async closure */) => {

    await require("./init.js");
    PRP.connect("localhost", "neo4j", "odrl");
    // await require("./setup.js");

    PXP.defineAction('test', function () { console.log("Lorem Ipsum") });

    PEP.request({
        target: { uid: "lorem_ipsum" },
        action: "read"
    })
        .then(console.log)
        .catch(console.error);

})(/* async closure */).catch(console.error);