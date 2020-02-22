const { util: _ } = package = require("..");
module.exports = enforceDecision;

/** 
 * @function enforceDecision
 * @param {Context}
 * @returns {undefined}
 * @async
 * @private
 */
async function enforceDecision(context) {
    _.log(package.decide, "enforceDecision", context);
    _.assert.instance(context, package.enforce.Context);
    const { policies, decision } = data = _.private(context);
    // TODO
}