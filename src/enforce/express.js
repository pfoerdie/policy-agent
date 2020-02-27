const { util: _ } = _package = require("..");
module.exports = express;

/**
 * @function enforce.express
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
        _.assert(_.is.object.notnull(request) && _.is.object.notnull(response) && _.is.function(next), "invalid arguments");
        _.assert(_.is.object.notnull(request.session), "invalid session");


        const context = await _package.enforce.request({
            action: "http:" + request.method,
            target: {
                "type": "File",
                "uid": request.url
            },
            assignee: request.session.user || null,
            assigner: null
        });

        // TODO 

        next();
    } catch (err) {
        _.log(err);
        console.error(err);
        // response.sendStatus(500);
        // debugger;
        response.status(500).send(err.message);
        // next(err);
    }
}