const { tools: _ } = _package = require("..");
const _stages = ["enforce", "info", "decide", "exec", "trash"];

class Context {

    constructor(request) {
        _.define(this, "id", _.uuid());
        _.log(this, "constructor", request);
        // _.log(_package.enforce, "Context", session, param);
        // TODO
        // _.assert.object(session, true);
        _.assert.object(request, true);
        // _.assert.string(param.target, 1);
        // _.assert.string(param.action, 1);
        // if (param.assignee) _.assert.string(param.assignee, 1);
        _package.private(this, { state: 0, request });
    }

    get stage() {
        return _stages[_package.private(this).state];
    }

    nextStage() {
        _.log(this, "nextStage");
        const data = _package.private(this);
        _.assert(data.state < _stages.length - 1, "last stage reached");
        data.state++;
    }

} // Context

module.exports = Context;