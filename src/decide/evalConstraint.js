const { util: _ } = _package = require("..");
module.exports = evalConstraint;

/** 
 * @function evalConstraint
 * @param {Context} context
 * @param {admin.Constraint} constraint
 * @returns {boolean}
 * @private
 */
function evalConstraint(context, constraint) {
    _.log(_package.decide, "evalConstraint", constraint);
    // _.assert.instance(context, _package.enforce.Context); // NOTE not good for performance
    _.assert.instance(constraint, _package.admin.Constraint);
    const operator = constraint.operator;
    const leftOperand = constraint._leftOperand || constraint.leftOperand;
    const rightOperand = constraint._rightOperand || constraint.rightOperand;
    // TODO
    return true;
}