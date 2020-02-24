const { util: _ } = package = require("..");

class Constraint {

    constructor(param, leftOperand, rightOperand) {
        _.log(this, "constructor", param, leftOperand, rightOperand);
        _.assert.object(param, true);
        _.assert.object(leftOperand);
        _.assert.object(rightOperand);

        Object.assign(this, param);
        _.enumerate(this, "_leftOperand", leftOperand);
        _.enumerate(this, "_rightOperand", rightOperand);
    }

}

module.exports = Constraint;