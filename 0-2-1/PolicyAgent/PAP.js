const
    _ = require("./tools.js"),
    _module = require("./package.js"),
    Context = require("./Context.js");

_.define(exports, '_cachePolicies', async function (context) {
    _.assert(context instanceof Context, "invalid context");
    _.assert(context.phase === 'cache_policies');
    // TODO
}); // PAP._cachePolicies