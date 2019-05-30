const
    _ = require("./tools.js"),
    _module = require("./index.js"),
    Context = require("./Context.js");

_.define(exports, '_expandAction', function (context) {
    _.assert(context instanceof Context, "invalid context");
    _.assert.equal(context.phase, 'expand_action');
    // TODO
}); // PXP._expandAction

_.define(exports, '_executeAction', function (context) {
    _.assert(context instanceof Context, "invalid context");
    _.assert.equal(context.phase, 'execute_action');
    // TODO
}); // PXP._executeAction