const { util: _ } = package = require("..");

class Asset {

    constructor(param) {
        _.log(this, "constructor", param);
        _.assert.object(param, true);
        _.assert.string(param.uid, 1);
        _.assert.array(param.type, 1, undefined, _.is.string.nonempty);
        Object.assign(this, param);
    }

}

module.exports = Asset;