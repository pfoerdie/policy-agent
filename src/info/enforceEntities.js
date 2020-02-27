const { util: _ } = _package = require("..");
module.exports = enforceEntities;

/** 
 * @function enforceEntities
 * @param {Context}
 * @returns {undefined}
 * @async
 * @private
 */
async function enforceEntities(context) {
    _.log(_package.info, "enforceEntities", context);
    _.assert.instance(context, _package.enforce.Context);
    const { param, ressource, subject } = _.private(context);
    const targetRecord = await _package.info.findAsset({ param: param.target });
    _.enumerate(ressource, "target", new _package.info.Asset(targetRecord[0].result));
    if (param.assignee) {
        const assigneeRecord = await _package.info.findParty({ param: param.assignee });
        if (assigneeRecord[0].result)
            _.enumerate(subject, "assignee", new _package.info.Party(assigneeRecord[0].result));
    }
    if (param.assigner) {
        const assignerRecord = await _package.info.findParty({ param: param.assigner });
        if (assignerRecord[0].result)
            _.enumerate(subject, "assigner", new _package.info.Party(assignerRecord[0].result));
    }
}