const
    PolicyAgent = require('./index.js');

let
    myAgent = new PolicyAgent(),
    secondAgent = new PolicyAgent(),
    myPEP = new myAgent.PEP(),
    myPIP = new myAgent.PIP(),
    myPRP = new myAgent.PRP(),
    myPDP = new myAgent.PDP({
        PIP: myPIP,
        PRP: myPRP
    }),
    myPAP = new myAgent.PAP();

myPEP.attachPDP(myPDP);
myPAP.attachPRP(myPRP);
