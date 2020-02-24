const { util: _ } = _package = require("..");
// NOTE mysterious error when naming it package without _

class Policy {

    constructor(param, rules) {
        _.log(this, "constructor", param, rules);
        _.assert.object(param, true);
        _.assert.string(param.uid, 1);
        _.assert.array(rules, 1, undefined, _.is.object.notempty);

        const permissions = [], prohibitions = [];
        for (let { type, rule, constraints } of rules) {
            rule = new _package.admin.Rule(rule, constraints);
            switch (type) {
                case "permission": permissions.push(rule); break;
                case "prohibition": prohibitions.push(rule); break;
            }
        }

        Object.assign(this, param);
        _.enumerate(this, "_permissions", permissions);
        _.enumerate(this, "_prohibitions", prohibitions);
    }

}

module.exports = Policy;