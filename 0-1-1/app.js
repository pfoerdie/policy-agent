const
    PolicyAgent = require('./index.js'),
    PEP = PolicyAgent.PEP;

let
    myPEP = new PEP('Lorem Ipsum');

console.log('PEP<ownKeys>:            ', Reflect.ownKeys(PEP));
console.log('PEP.prototype<ownKeys>:  ', Reflect.ownKeys(PEP.prototype));
console.log('myPEP<ownKeys>:          ', Reflect.ownKeys(myPEP));

console.log('myPEP:                   ', myPEP);
console.log('myPEP.args:              ', myPEP.args);
console.log('myPEP.argsGetter:        ', myPEP.argsGetter);

let returnenPEP = myPEP.publicMethod(myPEP);

console.log('returnenPEP:             ', returnenPEP);
console.log('Are the PEPs the same?   ', returnenPEP === myPEP);

return 0;