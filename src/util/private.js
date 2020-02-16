const _ = require(".");
const privateMap = new WeakMap();

module.exports = function (instance, input = null) {
    _.assert(_.is.Object(instance), "invalid instance");
    _.assert(_.is.object(input), "invalid input");
    let data = privateMap.get(instance);
    if (!data) {
        data = {};
        privateMap.set(instance, data);
    }
    if (input) Object.assign(data, input);
    return data;
};