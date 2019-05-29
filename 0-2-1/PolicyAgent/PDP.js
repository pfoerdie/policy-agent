const
    Assert = require('assert'),
    Context = require("./Context.js"),
    _module = require("./index.js"),
    T = require("./tools.js"),
    PDP = {};

T.define(PDP, '_makeDecision', function (context) {
    Assert(context instanceof Context, "invalid context");
    Assert.equal(context.phase, 'make_decision');
    // TODO
}); // PDP._makeDecision

module.exports = PDP;