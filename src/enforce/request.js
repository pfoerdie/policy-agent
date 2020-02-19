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
    const data = _.private(context, { env: {} });
    data.env.ts_init = _.now();
    await package.exec.enforce(context);
    await package.info.enforce(context); // TODO finish
    await package.decide.enforce(context); // TODO finish
    // TODO next steps
    data.env.ts_ready = _.now();
    _.log(data);
    console.log("Context", data);
    _.log("Request time: " + (data.env.ts_ready - data.env.ts_init) + " ms");
    return context;
} // request