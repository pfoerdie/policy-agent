const { util: _ } = _package = require("..");
module.exports = evalPolicy;

/** 
 * @function evalPolicy
 * @param {Context} context
 * @param {admin.Constraint} policy
 * @returns {string}
 * @private
 */
function evalPolicy(context, policy) {
    _.log(_package.decide, "evalPolicy", policy);
    // _.assert.instance(context, _package.enforce.Context); // NOTE not good for performance
    _.assert.instance(policy, _package.admin.Policy);
    const permissions = policy._permissions;
    const prohibitions = policy._prohibitions;
    const permissionsEval = permissions.map(rule => _package.decide.evalRule(context, rule));
    const prohibitionsEval = prohibitions.map(rule => _package.decide.evalRule(context, rule));
    // TODO
    debugger;
}