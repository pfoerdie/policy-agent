const
    _module = require("./index.js"),
    T = require("./tools.js");

class Context {

    constructor() {
        this.id = T.uuid();
        this.phase = 'idle';
        this.requests = new Map();
        this.cache = new Map();
        this.mainRequest = null;
        this.result = null;
        this.error = null;
        this.tss = null;
        this.tse = null;
        // TODO
    } // Context#constructor

    async exec(request) {
        T.assert.equal(this.phase, 'idle');
        T.assert(await _module.PRP.ping(), "PRP not connected");
        this.tss = T.hrt();
        try {

            this.phase = 'make_request';
            await _module.PEP._makeRequest(this, request);

            this.phase = 'expand_action';
            await _module.PXP._expandAction(this);

            this.phase = 'cache_entities';
            await _module.PIP._cacheEntities(this);

            this.phase = 'cache_policies';
            await _module.PAP._cachePolicies(this);

            this.phase = 'make_decision';
            await _module.PDP._makeDecision(this);

            this.phase = 'execute_action';
            await _module.PXP._executeAction(this);

            this.phase = 'success';

        } catch (err) {
            this.phase = 'error';
            this.error = err;
        }
        this.tse = T.hrt();
    } // Context#exec

} // Context

module.exports = Context;