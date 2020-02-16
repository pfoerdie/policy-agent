const { util: _ } = _package = require("..");
module.exports = io;

/**
 * @function io
 * @param {object} request 
 * @param {function} next
 * @returns {undefined}
 * @public
 * @async
 */
async function io(request, next) {
    try {

        _.log(_package.enforce, "io", request, next);
        _.assert(_.is.object.notnull(request) && _.is.function(next), "invalid arguments");
        _.assert(_.is.object(request.request.session), "invalid session");

        // const param = { action: null, assignee: null, target: null };
        // const context = new _package.enforce.Context(request.request.session, param);

        // const context = new _package.enforce.Context(request.request, request.request.res);

        // TODO 

        next();
    } catch (err) {
        _.log(err);
        next(err);
    }
} // io