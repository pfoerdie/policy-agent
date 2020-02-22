const { util: _ } = package = require("..");

class Constraint {

    constructor(param, leftOperand, rightOperand) {
        _.log(this, "constructor", param, leftOperand, rightOperand);
        _.assert.object(param, true);
        _.assert.object(leftOperand);
        _.assert.object(rightOperand);

        Object.assign(this, param);
        _.private(this, { leftOperand, rightOperand });
    }

}

module.exports = Constraint;