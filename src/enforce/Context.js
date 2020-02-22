const { util: _ } = package = require("..");

class Context {

    constructor(param) {
        _.define(this, "id", _.uuid());
        _.log(this, "constructor");
        _.assert.object(param, true);
        _.private(this, {
            param,
            ready: false,
            env: {
                ts_init: _.now(),
                ts_ready: null
            },
            action: null,
            actions: null,
            target: null,
            assignee: null,
            assigner: null,
            // IDEA !!!
            // param: Object.assign({
            //     action: null,
            //     target: null,
            //     assignee: null,
            //     assigner: null
            // }, param),
            // action: {
            //     use: null,
            //     transfer: null
            // },
            // environment: {
            //     ts_init: _.now(),
            //     ts_ready: null
            // },
            // ressource: {
            //     target: null
            // },
            // subject: {
            //     assignee: null,
            //     assigner: null
            // }
        });
    }

}

module.exports = Context;