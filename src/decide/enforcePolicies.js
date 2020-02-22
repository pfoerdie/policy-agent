const { util: _ } = package = require("..");
module.exports = enforcePolicies;

/** 
 * @function enforcePolicies
 * @param {Context}
 * @returns {undefined}
 * @async
 * @private
 */
async function enforcePolicies(context) {
    _.log(package.decide, "enforcePolicies", context);
    _.assert.instance(context, package.enforce.Context);
    const { actions, target, assignee, assigner } = _.private(context);
    const policyRecords = await package.decide.findPolicies({
        actions: Object.values(actions).map(action => action.id),
        target: target.uid,
        assignee: assignee ? assignee.uid : null,
        assigner: assigner ? assigner.uid : null
    });
    _.log(policyRecords);
    policyRecords.every(record => _.log(record));
    // TODO
}