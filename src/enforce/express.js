const { util: _ } = _package = require("..");
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
        _.assert(_.is.object.notnull(request) && _.is.object.notnull(response) && _.is.function(next), "invalid arguments");
        _.assert(_.is.object.notnull(request.session), "invalid session");

        const param = {
            action: {
                "type": "Action",
                "id": "http:" + request.method
            },
            target: {
                "type": "Asset",
                "uid": request.url
            },
            assignee: null
        };

        const context = new _package.enforce.Context(param);

        // TODO 

        next();
    } catch (err) {
        _.log(err);
        // response.sendStatus(500);
        response.status(500).send(err.message);
        // next(err);
    }
} // express