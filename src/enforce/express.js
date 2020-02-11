const { tools: _ } = _package = require("..");
module.exports = express;

/**
 * @function express
 * @param {object} request 
 * @param {object} response 
 * @param {function} next
 * @returns {undefined}
 * @public
 * @async
 */
async function express(request, response, next) {
    try {

        _.log(_package.enforce, "express", request, response, next);
        _.assert(_.is.object(request, true) && _.is.object(response) && _.is.function(next), "invalid arguments");
        _.assert(_.is.object(request.session), "invalid session");

        const param = { action: request.method, assignee: null, target: request.url };
        const context = new _package.enforce.Context(request.session, param);

        // TODO 

        next();
    } catch (err) {
        _.log(err);
        // response.sendStatus(500);
        response.status(500).send(err.message);
        // next(err);
    }
} // express