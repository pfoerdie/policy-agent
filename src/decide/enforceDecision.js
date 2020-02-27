const { util: _ } = _package = require("..");
module.exports = enforceDecision;

/** 
 * @function enforceDecision
 * @param {Context} context
 * @returns {undefined}
 * @private
 */
function enforceDecision(context) {
    _.log(_package.decide, "enforceDecision", context);
    _.assert.instance(context, _package.enforce.Context);
    const { policies, decision } = data = _.private(context);
    for (let policy of policies) {
        const tmp = _package.decide.evalPolicy(context, policy);
        // TODO
    }
    // TODO
}