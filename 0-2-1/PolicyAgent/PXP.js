const
    _ = require("./tools.js"),
    _module = require("./index.js"),
    Context = require("./Context.js");

let
    _actions = new Map();

_.define(exports, '_expandAction', async function (context) {
    _.assert(context instanceof Context, "invalid context");
    _.assert(context.phase === 'expand_action');
    let mainRequest = context.requests[0];
    _.assert(mainRequest.id === context.mainRequest);
    let result = await _module.PRP._extractActions(mainRequest.action);
    // TODO
}); // PXP._expandAction

_.define(exports, '_executeAction', function (context) {
    _.assert(context instanceof Context, "invalid context");
    _.assert(context.phase === 'execute_action');
    // TODO
}); // PXP._executeAction

_.enumerate(exports, 'defineAction', function (actionID, callback) {
    _.assert(actionID && typeof actionID === 'string' && !_actions.has(actionID), "invalid actionID");
    _.assert(typeof callback === 'function', "invalid callback");
    _actions.set(actionID, callback);
}); // PXP.defineAction