const { util: _ } = package = require("..");
module.exports = enforce;

/** 
 * @function decide.enforce
 * @param {Context}
 * @returns {undefined}
 * @async
 * @private
 */
async function enforce(context) {
    _.log(package.decide, "enforce", context);
    _.assert.instance(context, package.enforce.Context);
    const { actions, target, assignee, assigner } = _.private(context);
    // const policyRecords = await package.decide.findPolicies({
    //     actions: actions.map(action => action.id),
    //     target: target.uid,
    //     assignee: assignee ? assignee.uid : null,
    //     assigner: assigner ? assigner.uid : null
    // });
    // _.log(policyRecords);
    // TODO
}