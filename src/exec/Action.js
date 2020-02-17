const { util: _ } = package = require("..");

class Action {

    constructor(record) {
        _.assert.object(record, true);
        _.assert.string(record.id, 1);
        _.define(this, "id", record.id);

        _.log(this, "constructor");

        if (record.id === "use" || record.id === "transfer")
            _.define(this, "includedIn", null);
        else {
            _.assert.array(record.includedIn, 1, 1, _.is.string.nonempty);
            _.define(this, "includedIn", record.includedIn[0]);
        }

        _.assert.array(record.implies, undefined, undefined, _.is.string.nonempty);
        _.define(this, "implies", record.implies);
    }

} // Action

module.exports = Action;