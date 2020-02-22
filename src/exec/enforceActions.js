const { util: _ } = package = require("..");
module.exports = enforceActions;

/** 
 * @function enforceActions
 * @param {Context}
 * @returns {undefined} 
 * @async
 * @private
 */
async function enforceActions(context) {
    _.log(package.exec, "enforceActions", context);
    _.assert.instance(context, package.enforce.Context);
    const { param, action } = _.private(context);
    _.assert.string(param.action, 1);
    const records = await package.exec.findAction({ action: param.action });
    _.assert(records.length > 0 && records[0].id === param.action, "invalid first result");
    const { actionMap } = _.private(package.exec);

    for (let record of records) {
        _.assert(actionMap.has(record.id), "action not defined");
        _.enumerate(action, record.id, new package.exec.Action(record));
    }
}