const
    _ = require("./tools.js"),
    _module = require("./package.js"),
    Context = require("./Context.js");

_.define(exports, '_makeDecision', function (context) {
    _.assert(context instanceof Context, "invalid context");
    _.assert(context.phase === 'make_decision');
    // TODO
}); // PDP._makeDecision