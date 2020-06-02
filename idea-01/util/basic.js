exports.assert = require("assert");
exports.uuid = require("uuid/v4");
exports.define = (obj, key, value, get, set) => Object.defineProperty(obj, key, get || set ? { get, set } : { value });
const enumerable = true;
exports.enumerate = (obj, key, value, get, set) => Object.defineProperty(obj, key, get || set ? { get, set, enumerable } : { value, enumerable });
exports.promify = (fn, ...args) => new Promise((resolve, reject) => fn(...args, (err, result) => err ? reject(err) : resolve(result)));
Object.freeze(exports);
