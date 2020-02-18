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
    // const targetArr = await package.repo.query(package.info.findAsset, param.target);
    // const assigneeArr = await package.repo.query(package.info.findParty, param.assignee);
    // TODO
}