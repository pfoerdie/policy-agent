const { util: _ } = package = require("..");
module.exports = enforce;

/** 
 * @function decide.enforce
 * @param {Context}
 * @returns {undefined}
 * @async
 * @private
 */
async function enforce(context) {
    _.log(package.decide, "enforce", context);
    _.assert.instance(context, package.enforce.Context);
    // TODO
}