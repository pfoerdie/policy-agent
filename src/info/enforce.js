const { util: _ } = package = require("..");
module.exports = enforce;

/** 
 * @function info.enforce
 * @param {Context}
 * @returns {undefined}
 * @async
 * @private
 */
async function enforce(context) {
    _.log(package.info, "enforce", context);
    _.assert.instance(context, package.enforce.Context);
    const { param } = _.private(context);
    const target = (await package.info.findAsset({ param: param.target }))[0].result;
    _.assert.object(target, true);
    _.assert.string(target.uid, 1);
    _.assert.array(target.type, 1, undefined, _.is.string.nonempty);
    const assignee = param.assignee ? (await package.info.findParty({ param: param.assignee }))[0].result : null;
    _.assert.object(assignee);
    if (assignee) {
        _.assert.string(assignee.uid, 1);
        _.assert.array(assignee.type, 1, undefined, _.is.string.nonempty);
    }
    _.private(context, { target, assignee });
}