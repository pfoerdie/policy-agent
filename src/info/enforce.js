const { util: _ } = package = require("..");
module.exports = enforce;

/** 
 * @function info.enforce
 * @param {Context}
 * @returns {undefined}
 * @async
 * @private
 */
function enforce(context) {
    _.log(package.info, "enforce", context);
    _.assert.instance(context, package.enforce.Context);
    // const targetRecords = await package.info.findAsset(param.target);
    // const assigneeRecords = await package.info.findParty(param.assignee);
    // TODO
}