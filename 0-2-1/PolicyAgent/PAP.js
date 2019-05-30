const
    _module = require("./index.js"),
    Context = require("./Context.js"),
    T = require("./tools.js");

T.define(exports, '_cachePolicies', async function (context) {
    T.assert(context instanceof Context, "invalid context");
    T.assert.equal(context.phase, 'cache_policies');
    // TODO
}); // PAP._cachePolicies