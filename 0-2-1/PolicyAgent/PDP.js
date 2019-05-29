const
    Assert = require('assert'),
    Context = require("./Context.js"),
    PRP = require("./PRP.js"),
    T = require("./tools.js"),
    PDP = {};

T.define(PDP, '_makeDecision', function (context) {
    Assert(context instanceof Context, "invalid context");
    Assert.equal(this.phase, 'make_decision');
    // TODO
}); // PDP._makeDecision

module.exports = PDP;