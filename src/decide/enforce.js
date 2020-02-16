const { util: _ } = package = require("..");
module.exports = enforce;

async function enforce(context) {
    _.log(package.decide, "enforce", context);
    _.assert.instance(context, package.enforce.Context);
    // TODO
}