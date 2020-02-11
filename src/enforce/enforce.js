const _ = require("../tools");
module.exports = enforce;
_.define(enforce, "id", "PolicyAgent.enforce");
const _module = require("..");
const Context = require("./Context.js");
_.define(enforce, "Context", Context);

/**
 * @function enforce
 * @param {object} request 
 * @param {object} [response = null] 
 * @param {function} [next] 
 * @returns {undefined}
 * @public
 * @async
 */
async function enforce(request, response = null, next = () => null) {
    try {

        _.log(_module, "enforce", request, response, next);
        _.assert(_.is.object(request, true) && _.is.object(response) && _.is.function(next), "invalid arguments");
        _.assert(_.is.object(request.session), "invalid session");

        const param = { action: request.method, assignee: null, target: request.url };
        const context = new Context(request.session, param);
        context.nextStage();

        // TODO 

        next();
    } catch (err) {
        _.log(err);
        if (response && _.is.function(response.sendStatus))
            response.sendStatus(500);
        // TODO
    }
} // enforce