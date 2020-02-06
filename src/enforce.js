/**
 * @module PolicyAgent.enforce
 * @author Simon Petrac
 */

const _ = require("./tools.js");
const _module = require("./index.js");
module.exports = Enforce;

/**
 * @function enforce
 * @param {object} [config = null] 
 * @returns {function}
 * @public
 */
function Enforce(config = null) {

    _.log(_module, "enforce", config);

    _.assert.object(config);

    /**
     * @function enforce()
     * @param {object} request 
     * @param {object} response 
     * @param {function} [next] 
     * @returns {undefined}
     * @public
     * @async
     */
    async function enforce(request, response, next) {

        _.log(enforce, "call", this, request, response, next);
        // _.log(Enforce, "constructor", request, response, next);

        try {

            // TODO

            if (_.is.function(next)) next();
        } catch (err) {
            _.log(err);
            if (_.is.function(next)) next(err);
        }

    } // enforce

    _.define(enforce, "id", "PolicyAgent.enforce()");

    return enforce;

} // Enforce

_.define(Enforce, "id", "PolicyAgent.enforce");