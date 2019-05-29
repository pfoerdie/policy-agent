const
    Assert = require('assert'),
    Context = require("./Context.js"),
    PRP = require("./PRP.js"),
    T = require("./tools.js"),
    PAP = {};

T.define(PAP, '_cachePolicies', async function (context) {
    Assert(context instanceof Context, "invalid context");
    Assert.equal(context.phase, 'cache_policies');
    // TODO
}); // PAP._cachePolicies

module.exports = PAP;