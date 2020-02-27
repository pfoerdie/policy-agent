const { util: _ } = _package = require("..");
module.exports = request;

/**
 * @function enforce.request
 * @param {object} param 
 * @returns {Context}
 * @public
 * @async
 */
async function request(param) {
    _.log(_package.enforce, "request", param);
    const context = new _package.enforce.Context(param);
    const { environment } = _.private(context);
    _.define(environment, "ts_init", _.now());
    await _package.exec.enforceActions(context);
    await _package.info.enforceEntities(context);
    await _package.admin.enforcePolicies(context);
    await _package.decide.enforceDecision(context);
    // TODO next steps
    _.define(environment, "ts_ready", _.now());
    _.log("Request time: " + (environment.ts_ready - environment.ts_init) + " ms");
    return context;
    debugger;
}