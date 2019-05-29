const { PRP, PIP, PAP, PDP, PXP, PEP } = require("../PolicyAgent");

(async (/* async closure */) => {

    PRP.connect(undefined, undefined, "odrl");
    // console.log(await PRP.ping());
    console.log(await PEP.request({}));

})(/* async closure */).catch(console.error);