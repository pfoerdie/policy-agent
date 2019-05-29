const
    Assert = require('assert'),
    Context = require("./Context.js"),
    _module = require("./index.js"),
    T = require("./tools.js"),
    PXP = {};

T.define(PXP, '_expandAction', function (context) {
    Assert(context instanceof Context, "invalid context");
    Assert.equal(context.phase, 'expand_action');
    // TODO
}); // PXP._expandAction

T.define(PXP, '_executeAction', function (context) {
    Assert(context instanceof Context, "invalid context");
    Assert.equal(context.phase, 'execute_action');
    // TODO
}); // PXP._executeAction

module.exports = PXP;