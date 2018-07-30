const
    PolicyAgent = require('./index.js');

let
    myAgent = new PolicyAgent(),
    myPEP = new myAgent.PEP(),
    myPIP = new myAgent.PIP(),
    myPRP = new myAgent.PRP(),
    myPDP = new myAgent.PDP(),
    myPAP = new myAgent.PAP();

console.log(myAgent);
console.log(myPEP);
console.log(myPIP);
console.log(myPRP);
console.log(myPDP);
console.log(myPAP);