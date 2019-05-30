const
    _module = require("./index.js"),
    Context = require("./Context.js"),
    T = require("./tools.js");

T.define(exports, '_makeDecision', function (context) {
    T.assert(context instanceof Context, "invalid context");
    T.assert.equal(context.phase, 'make_decision');
    // TODO
}); // PDP._makeDecision