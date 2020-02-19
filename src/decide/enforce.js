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
    const data = _.private(context);
    // const policyRecords = await package.decide.findPolicies(data);
    // _.log(policyRecords);
    // TODO
}