const { util: _ } = package = require("..");

class Context {

    constructor(param) {
        _.define(this, "id", _.uuid());
        _.log(this, "constructor");
        _.assert.object(param, true);
        _.define(this, "ts", _.now());
        _.private(this, { param });
    }

} // Context

module.exports = Context;