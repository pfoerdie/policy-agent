const { util: _ } = package = require("..");

class Action {

    constructor(record) {
        _.log(this, "constructor", record);

        _.assert.object(record, true);
        _.assert.string(record.id, 1);
        _.enumerate(this, "id", record.id);

        if (record.id === "use" || record.id === "transfer")
            _.enumerate(this, "includedIn", null);
        else {
            _.assert.array(record.includedIn, 1, 1, _.is.string.nonempty);
            _.enumerate(this, "includedIn", record.includedIn[0]);
        }

        _.assert.array(record.implies, undefined, undefined, _.is.string.nonempty);
        _.enumerate(this, "implies", record.implies);
    }

}

module.exports = Action;