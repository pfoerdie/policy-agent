const { util: _ } = _package = require("..");
// NOTE mysterious error when naming it _package without _

class Rule {

    constructor(param, constraints) {
        _.log(this, "constructor", param, constraints);
        _.assert.object(param, true);
        _.assert.array(constraints, undefined, undefined, _.is.object.notempty);

        constraints = constraints.map(
            ({ constraint, leftOperand, rightOperand }) =>
                new _package.admin.Constraint(constraint, leftOperand, rightOperand)
        );

        Object.assign(this, param);
        _.enumerate(this, "_constraints", constraints);
    }

}

module.exports = Rule;