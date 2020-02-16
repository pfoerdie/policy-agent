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
    await package.exec.enforce(context); // TODO finish
    debugger;
    await package.info.enforce(context); // TODO finish
    await package.decide.enforce(context); // TODO finish
    // TODO next steps
    return context;
} // request