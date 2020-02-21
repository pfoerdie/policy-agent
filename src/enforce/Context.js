const { util: _ } = package = require("..");

class Context {

    constructor(param) {
        _.define(this, "id", _.uuid());
        _.log(this, "constructor");
        _.assert.object(param, true);
        _.private(this, { param });
    }

}

module.exports = Context;