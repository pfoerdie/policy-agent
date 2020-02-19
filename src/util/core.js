const UUID = require("uuid/v4");
// const Handlebars = require("handlebars");

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

exports.now = function () {
    return Date.now();
};

// exports.hbs = function (template) {
//     return Handlebars.compile(template);
// };

exports.minimizeStr = function (input) {
    return input.trim()
        .replace(/\/\/.*$/mg, "")
        .replace(/\s+/g, " ");
};