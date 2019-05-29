const
    Assert = require('assert'),
    T = require("./tools.js");

let PRP, PIP, PAP, PDP, PXP, PEP, _ready = false;

process.nextTick(function () {
    PRP = require("./PRP.js");
    PIP = require("./PIP.js");
    PAP = require("./PAP.js");
    PDP = require("./PDP.js");
    PXP = require("./PXP.js");
    PEP = require("./PEP.js");
    _ready = true;
});

class Context {

    constructor() {
        Assert(_ready, "not ready yet");
        this.phase = 'idle';
        this.id = T.uuid();
        this.tss = T.hrt();
        this.requests = new Map();
        this.cache = new Map();
        // TODO
    } // Context#constructor

    async exec(request) {
        Assert.equal(this.phase, 'idle');
        try {

            this.phase = 'make_request';
            await PEP._makeRequest(this, request);

            this.phase = 'expand_action';
            await PXP._expandAction(this);

            this.phase = 'cache_entities';
            await PIP._cacheEntities(this);

            this.phase = 'cache_policies';
            await PAP._cachePolicies(this);

            this.phase = 'make_decision';
            await PDP._makeDecision(this);

            this.phase = 'execute_action';
            await PXP._executeAction(this);

            this.phase = 'success';
            this.tse = T.hrt();

        } catch (err) {
            this.phase = 'error';
            this.tse = T.hrt();
            throw err;
        }
    } // Context#exec

} // Context

module.exports = Context;