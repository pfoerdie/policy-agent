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
        else if (_.is.string.nonempty(instance.uid))
            _.define(data, "id", instance.uid);
        privateMap.set(instance, data);
    }
    if (input) {
        const keys = Object.keys(input);
        _.assert(keys.every(key => !Reflect.has(data, key)), "override not possible");
        Object.assign(data, input);
        for (let key of keys) { data[key] = input[key]; }
    }
    return data;
};