const
    _module = require("./index.js"),
    Context = require("./Context.js"),
    T = require("./tools.js");

T.define(exports, '_expandAction', function (context) {
    T.assert(context instanceof Context, "invalid context");
    T.assert.equal(context.phase, 'expand_action');
    // TODO
}); // PXP._expandAction

T.define(exports, '_executeAction', function (context) {
    T.assert(context instanceof Context, "invalid context");
    T.assert.equal(context.phase, 'execute_action');
    // TODO
}); // PXP._executeAction