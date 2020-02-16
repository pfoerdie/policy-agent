const _ = require(".");

// const util = require("util");

// for (let [key, value] of Object.entries(util)) {
//     if (key.startsWith("is") && util.isFunction(value)) {
//         exports[key.substr(2)] = value;
//     }
// }

// for (let [key, value] of Object.entries(util.types)) {
//     if (key.startsWith("is") && util.isFunction(value)) {
//         exports[key.substr(2)] = value;
//     }
// }

exports.number = function (value) {
    return typeof value === "number" && !isNaN(value);
};

exports.number.int = function (value) {
    return _.is.number(value) && value === parseInt(value);
};

exports.number.uint = function (value) {
    return _.is.number.int(value) && value >= 0;
};

exports.number.real = function (value) {
    return _.is.number(value) && value > -Infinity && value < Infinity;
};

exports.string = function (value) {
    return typeof value === "string";
};

exports.string.nonempty = function (value) {
    return value && _.is.string(value);
};

exports.function = function (value) {
    return typeof value === "function";
};

exports.object = function (value) {
    return typeof value === "object";
};

exports.object.notnull = function (value) {
    return value && _.is.object(value);
};

exports.Object = function (value) {
    return value instanceof Object;
};

exports.Array = function (value) {
    return Array.isArray(value);
};