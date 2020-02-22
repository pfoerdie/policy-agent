const { util: _ } = package = require("..");
module.exports = request;

/**
 * @function enforce.request
 * @param {object} param 
 * @returns {Context}
 * @public
 * @async
 */
async function request(param) {
    _.log(package.enforce, "request", param);
    const context = new package.enforce.Context(param);
    const { environment } = _.private(context);
    _.define(environment, "ts_init", _.now());
    await package.exec.enforceActions(context);
    await package.info.enforceEntities(context);
    await package.admin.enforcePolicies(context);
    await package.decide.enforceDecision(context);
    // TODO next steps
    _.define(environment, "ts_ready", _.now());
    _.log("Request time: " + (environment.ts_ready - environment.ts_init) + " ms");
    return context;
}