const { util: _ } = package = require("..");
module.exports = request;

/**
 * @function request
 * @param {object} param 
 * @returns {Context}
 * @public
 * @async
 */
async function request(param) {
    _.log(package.enforce, "request", param);
    const context = new package.enforce.Context(param);
    await package.exec.enforce(context);
    await package.info.enforce(context);
    await package.decide.enforce(context);
    // TODO next steps
    // debugger;
    return context;
} // request