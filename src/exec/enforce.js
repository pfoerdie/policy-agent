const { util: _ } = package = require("..");
module.exports = enforce;

/** 
 * @function enforce
 * @param {Context}
 * @returns {undefined} 
 * @async
 * @private
 */
async function enforce(context) {
    _.log(package.exec, "enforce", context);
    _.assert.instance(context, package.enforce.Context);
    const { param } = _.private(context);
    _.assert.string(param.action, 1);
    const result = await package.repo.query(package.exec.findActions, { id: param.action });
    // _.assert(result.length === 1 && result[0].id === param.action, "invalid result");
    // _.log(result[0]);
    console.log(result);
    // TODO
}