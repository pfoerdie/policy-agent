const { util: _ } = package = require("..");
module.exports = enforceEntities;

/** 
 * @function enforceEntities
 * @param {Context}
 * @returns {undefined}
 * @async
 * @private
 */
async function enforceEntities(context) {
    _.log(package.info, "enforceEntities", context);
    _.assert.instance(context, package.enforce.Context);
    const { param, ressource, subject } = _.private(context);
    const targetRecord = await package.info.findAsset({ param: param.target });
    _.enumerate(ressource, "target", new package.info.Asset(targetRecord[0].result));
    if (param.assignee) {
        const assigneeRecord = await package.info.findParty({ param: param.assignee });
        if (assigneeRecord[0].result)
            _.enumerate(subject, "assignee", new package.info.Party(assigneeRecord[0].result));
    }
    if (param.assigner) {
        const assignerRecord = await package.info.findParty({ param: param.assigner });
        if (assignerRecord[0].result)
            _.enumerate(subject, "assigner", new package.info.Party(assignerRecord[0].result));
    }
}