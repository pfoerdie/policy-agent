const { PRP, PIP, PAP, PDP, PXP, PEP } = require("../PolicyAgent");

(async (/* async closure */) => {

    PRP.connect(undefined, undefined, "odrl");
    console.log(await PRP.ping());

})(/* async closure */).catch(console.error);