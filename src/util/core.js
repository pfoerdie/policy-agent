const UUID = require("uuid/v4");
// const Assert = require("assert");

exports.set = function (obj, key, value) {
    const enumerable = true, writable = true;
    Object.defineProperty(obj, key, { value, enumerable, writable });
};

exports.define = function (obj, key, value, get, set) {
    Object.defineProperty(obj, key, (get || set) ? { get, set } : { value });
};

exports.enumerate = function (obj, key, value, get, set) {
    const enumerable = true;
    Object.defineProperty(obj, key, (get || set) ? { get, set, enumerable } : { value, enumerable });
};

exports.uuid = function () {
    return UUID();
};