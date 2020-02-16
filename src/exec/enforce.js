const { util: _ } = package = require("..");
module.exports = enforce;

async function enforce(context) {
    _.log(package.exec, "enforce", context);
    _.assert.instance(context, package.enforce.Context);
    const { param } = _.private(context);
    _.assert.string(param.action, 1);
    const actionArr = await package.repo.query(package.exec.findActions, { id: param.action });
    // TODO
    console.log("actionArr:", actionArr);
    debugger;
}