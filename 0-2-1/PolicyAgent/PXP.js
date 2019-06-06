const
    _ = require("./tools.js"),
    _module = require("./package.js"),
    Context = require("./Context.js");

let
    _actions = new Map();

_.define(exports, '_expandAction', async function (context) {
    _.assert(context instanceof Context, "invalid context");
    _.assert(context.phase === 'expand_action');
    let mainRequest = context.requests.get(context.mainRequest);
    _.assert(mainRequest);
    let defResult = await _module.PRP._extractActions(mainRequest.action);
    let defMap = new Map(defResult.map(val => [val.id, val]));
    (function expandAction(requestID) {
        let request = contest.requests.get(request.id);
        let def = defMap.get(request.action);
        _.assert(def);
        // TODO find good solution
        // _.define(request, 'includedIn', def.includedIn ? null : _module.PEP._makeRequest(context, {}));
    })(mainRequest.action);
    console.log(result);
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