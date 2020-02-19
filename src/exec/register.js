const { util: _ } = package = require("..");
module.exports = register;

/**
 * @function exec.register
 * @param {string} id
 * @param {string} [includedIn="use"]
 * @param {Array<string>} [implies=[]]
 * @returns {undefined}
 * @public
 * @async
 */
async function register(id, includedIn = "use", implies = []) {

    _.log(package.exec, "register", id, includedIn, implies);
    _.assert.string(id, 1);
    _.assert(id !== "use" && id !== "transfer", "use and transfer are reserved actions");
    _.assert.string(includedIn, 1);
    _.assert.array(implies, undefined, undefined, _.is.string.nonempty);

    const result = await package.exec.mergeAction({ id, includedIn, implies });
    _.assert(result.length === 1 && result[0].id === id, "invalid result");

}