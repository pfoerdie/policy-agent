const { util: _ } = package = require("..");

class Context {

    constructor(param) {
        _.define(this, "id", _.uuid());
        _.log(this, "constructor");
        _.assert.object(param, true);
        _.private(this, {
            param: Object.assign({
                /** @type {string} */
                action: null,
                /** @type {object} */
                target: null,
                /** @type {object} */
                assignee: null,
                /** @type {object} */
                assigner: null
            }, param),
            action: {
                /** @type {exec.Action} */
            },
            environment: {
                /** @type {number} */
                ts_init: null,
                /** @type {number} */
                ts_ready: null
            },
            ressource: {
                /** @type {info.Asset} */
                target: null
            },
            subject: {
                /** @type {info.Party} */
                assignee: null,
                /** @type {info.Party} */
                assigner: null
            },
            /** @type {Array<admin.Policy>} */
            policies: [],
            decision: {
                authorization: false
            }
        });
    }

}

module.exports = Context;