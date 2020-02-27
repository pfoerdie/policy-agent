const { util: _ } = _package = require("..");
module.exports = evalRule;

/** 
 * @function evalRule
 * @param {Context} context
 * @param {admin.Rule} rule
 * @returns {boolean|undefined}
 * @private
 */
function evalRule(context, rule) {
    _.log(_package.decide, "evalRule", rule);
    // _.assert.instance(context, _package.enforce.Context); // NOTE not good for performance
    _.assert.instance(rule, _package.admin.Rule);
    const constraints = rule._constraints;
    if (constraints.length > 0 &&
        !constraints.every(constraint => _package.decide.evalConstraint(context, constraint))
    ) return undefined;
    // TODO
    debugger;
}