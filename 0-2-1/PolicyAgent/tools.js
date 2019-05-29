exports.define = (obj, key, val) => Object.defineProperty(obj, key, { value: val });
exports.defineGetter = (obj, key, getter) => Object.defineProperty(obj, key, { get: getter });