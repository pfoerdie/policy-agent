/**
 * @module PolicyAgent.enforce
 * @author Simon Petrac
 */

const _ = require("./tools.js");
const _module = require(".");
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
     * @param {object} [response = null] 
     * @param {function} [next] 
     * @returns {undefined}
     * @public
     * @async
     */
    async function enforce(request, response = null, next = () => null) {

        _.log(enforce, "call", this, request, response, next);
        _.assert(_.is.object(request, true) && _.is.object(response) && _.is.function(next), "invalid arguments");

        try {

            // TODO 

            next();

        } catch (err) {

            _.log(err);
            next(err);

        }

    } // enforce

    _.define(enforce, "id", "PolicyAgent.enforce()");

    return enforce;

} // Enforce

_.define(Enforce, "id", "PolicyAgent.enforce");