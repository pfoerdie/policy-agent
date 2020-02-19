const _ = require(".");
const privateMap = new WeakMap();

class Data { }

module.exports = function (instance, input = null) {
    _.assert(_.is.Object(instance), "invalid instance");
    _.assert(_.is.object(input), "invalid input");
    let data = privateMap.get(instance);
    if (!data) {
        data = new Data();
        if (_.is.string.nonempty(instance.id))
            _.define(data, "id", instance.id);
        privateMap.set(instance, data);
    }
    if (input) Object.assign(data, input);
    return data;
};