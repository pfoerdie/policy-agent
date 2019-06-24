const
    _ = require("./tools.js"),
    _module = require("./package.js");

class Context {

    constructor() {
        _.enumerate(this, 'id', _.uuid());
        this.phase = 'idel';
        _.define(this, 'requests', new Map());
        _.define(this, 'cache', new Map());
        this.tss = 0;
        this.tse = 0;
        this.mainRequest = null;
        this.result = null;
        this.error = null;
    } // Context#constructor

    get lifetime() {
        return this.tss ? (this.tse || _.hrt()) - this.tss : 0;
    }

    async exec(request) {
        _.assert(this.phase === 'idle' && !this._tss && !this._tse, "Context already executed");
        _.assert(await _module.PRP.ping(), "PRP not connected");
        _.define(this, 'tss', _.hrt());
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

            _.enumerate(this, '_phase', 'success');
        } catch (err) {
            _.enumerate(this, '_phase', 'error');
            _.enumerate(this, 'error', err);
        }
        _.define(this, 'tse', _.hrt());
    } // Context#exec

} // Context

module.exports = Context;