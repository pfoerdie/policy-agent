const
    Assert = require('assert'),
    PRP = require("./PRP.js"),
    PIP = require("./PIP.js"),
    PAP = require("./PAP.js"),
    PDP = require("./PDP.js"),
    PXP = require("./PXP.js"),
    PEP = require("./PEP.js");

class Context {

    constructor() {
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

            this.phase = 'finished';
            this.tse = T.hrt();

        } catch (err) {
            this.phase = 'failed';
            this.tse = T.hrt();
            throw err;
        }
    } // Context#exec

} // Context

module.exports = Context;