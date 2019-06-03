const
    UUID = require('uuid/v4');

exports.define = (obj, key, val) =>
    Object.defineProperty(obj, key, { value: val });
exports.defineGetter = (obj, key, getter) =>
    Object.defineProperty(obj, key, { get: getter });
exports.enumerate = (obj, key, val) =>
    Object.defineProperty(obj, key, { value: val, enumerable: true });

exports.assert = (value, errorMsg) => {
    if (!value) {
        let err = new Error(errorMsg);
        err.stack = err.stack.replace(/^.*at .*\.assert \(.*\n/m, "");
        throw err;
    }
}; // exports.assert

exports.hrt = Date.now;
exports.uuid = UUID;