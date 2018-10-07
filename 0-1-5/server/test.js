const
    Path = require('path'),
    Fs = require('fs'),
    PolicyAgent = require('..');

(async (/* #region MAIN */) => {

    let myPAP = new PolicyAgent.PAP({
        password: "odrl"
    });

    let result = await myPAP._retrievePolicies(`MATCH (n:ODRL:Action {id: "use"}) RETURN n`);
    console.log(result);

    return 0;

})(/* #endregion MAIN */)
    .catch(console.error);