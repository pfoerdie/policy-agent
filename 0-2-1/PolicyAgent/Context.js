const
    _ = require("./tools.js"),
    _module = require("./package.js"),
    _private = new WeakMap();

class Context {

    constructor() {
        _private.set(this, {
            id: _.uuid(),
            phase: 'idle',
            tss: 0,
            tse: 0
        });
        _.define(this, 'requests', new Map());
        _.define(this, 'cache', new Map());
        this.mainRequest = null;
        this.result = null;
        this.error = null;
        // TODO
    } // Context#constructor

    get id() {
        return _private.get(this).id;
    }

    get phase() {
        return _private.get(this).phase;
    }

    get lifetime() {
        const _attr = _private.get(this);
        return _attr.tss ? (_attr.tse || _.hrt()) - _attr.tss : 0;
    }

    async exec(request) {
        const _attr = _private.get(this);
        _.assert(_attr, "Context invalid");
        _.assert(_attr.phase === 'idle', "Context already executed");
        _.assert(await _module.PRP.ping(), "PRP not connected");
        _attr.tss = _.hrt();
        try {

            _attr.phase = 'make_request';
            await _module.PEP._makeRequest(this, request);

            _attr.phase = 'expand_action';
            await _module.PXP._expandAction(this);

            _attr.phase = 'cache_entities';
            await _module.PIP._cacheEntities(this);

            _attr.phase = 'cache_policies';
            await _module.PAP._cachePolicies(this);

            _attr.phase = 'make_decision';
            await _module.PDP._makeDecision(this);

            _attr.phase = 'execute_action';
            await _module.PXP._executeAction(this);

            _attr.phase = 'success';

        } catch (err) {
            _attr.phase = 'error';
            _.define(this, 'error', err);
        }
        _attr.tse = _.hrt();
    } // Context#exec

} // Context

module.exports = Context;