const
    UUID = require('uuid/v4');

exports.define = (obj, key, val) => Object.defineProperty(obj, key, { value: val });
exports.defineGetter = (obj, key, getter) => Object.defineProperty(obj, key, { get: getter });
exports.enumerate = (obj, key, val) => Object.defineProperty(obj, key, { value: val, enumerable: true });
exports.hrt = Date.now;
exports.uuid = UUID;