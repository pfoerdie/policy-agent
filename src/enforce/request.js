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
    const env = {};
    _.private(context, { env });
    env.ts_init = _.now();
    await package.exec.enforce(context);
    await package.info.enforce(context); // TODO finish
    await package.decide.enforce(context); // TODO finish
    // TODO next steps
    env.ts_ready = _.now();
    console.log("Context->private:", _.private(context));
    return context;
} // request