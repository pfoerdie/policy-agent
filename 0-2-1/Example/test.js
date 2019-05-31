const { PRP, PIP, PAP, PDP, PXP, PEP } = require("../PolicyAgent");


(async (/* async closure */) => {

    // await require("./setup.js");

    PRP.connect(undefined, undefined, "odrl");

    PXP.defineAction('test', function () { console.log("Lorem Ipsum") });

    PEP.request()
        .then(console.log)
        .catch(console.error);

})(/* async closure */).catch(console.error);