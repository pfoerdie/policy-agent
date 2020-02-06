/**
 * @module PolicyAgent.enforce
 * @author Simon Petrac
 */

const _ = require("./tools.js");
const _module = require("./index.js");

module.exports = function (config = null) {

    _.assert.object(config);

    async function enforce(request, response, next) {

        _.log(enforce, "call", null, request, response, next);

        // TODO

        if (_.is.function(next)) next();

    } // enforce

    return enforce;

}; // module.exports