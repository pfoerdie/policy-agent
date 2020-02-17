const { util: _ } = package = require("..");
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

        _.log(package.enforce, "express", request, response, next);
        _.assert(_.is.object.notnull(request) && _.is.object.notnull(response) && _.is.function(next), "invalid arguments");
        _.assert(_.is.object.notnull(request.session), "invalid session");


        const context = await package.enforce.request({
            action: "http:" + request.method,
            target: {
                "type": "Asset",
                "uid": request.url
            },
            assignee: null
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
} // express