const { tools: _ } = _package = require("..");
const States = ["init"];

class Context {

    constructor(session, param = null) {
        _.define(this, "id", _.uuid());
        _.log(this, "constructor", session, param);
        // TODO
        _.assert.object(session, true);
        _.assert.object(param);
        _.enumerate(this, "session", session);
        _.enumerate(this, "param", param);
        this._state = 0;
    }

    get stage() {
        return States[this._state];
    }

    nextStage() {
        // TODO
        if (this._state < States.length) this._state++;
    }

} // Context

module.exports = Context;