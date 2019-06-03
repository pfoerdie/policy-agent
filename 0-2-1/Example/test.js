const { PRP, PIP, PAP, PDP, PXP, PEP } = require("../PolicyAgent");


(async (/* async closure */) => {

    await require("./init.js");
    await require("./setup.js");

    PXP.defineAction('test', function () { console.log("Lorem Ipsum") });

    PEP.request()
        .then(console.log)
        .catch(console.error);

})(/* async closure */).catch(console.error);