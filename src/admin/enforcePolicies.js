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
    _.log(package.admin, "enforcePolicies", context);
    _.assert.instance(context, package.enforce.Context);

    const { action, ressource, subject, policies } = _.private(context);
    const policyRecords = await package.admin.findPolicies({
        actions: Object.values(action).map(({ id }) => id),
        target: ressource.target.uid,
        assignee: subject.assignee ? subject.assignee.uid : null,
        assigner: subject.assigner ? subject.assigner.uid : null
    });

    for (let record of policyRecords) { policies.push(new package.admin.Policy(record.policy, record.rules)); }
    Object.freeze(policies);
}