exports.boolean = function (value) {
    return typeof value === "boolean";
};

exports.number = function (value) {
    return typeof value === "number" && !isNaN(value);
};

exports.number.integer = function (value) {
    return typeof value === "number" && value === parseInt(value);
};

exports.string = function (value) {
    return typeof value === "string";
};

exports.string.nonempty = function (value) {
    return typeof value === "string" && value.length > 0;
};

const RE_uid = /^\S+$/;
exports.string.uid = function (value) {
    return typeof value === "string" && RE_uid.test(value);
};

const RE_url = /^https?:\/\/\S+$/;
exports.string.url = function (value) {
    return typeof value === "string" && RE_url.test(value);
};

exports.symbol = function (value) {
    return typeof value === "symbol";
};

exports.array = function (value) {
    return Array.isArray(value);
};

exports.array.nonempty = function (value) {
    return Array.isArray(value) && value.length > 0;
};

exports.object = function (value) {
    return typeof value === "object";
};

exports.object.nonnull = function (value) {
    return typeof value === "object" && value !== null;
};

exports.function = function (value) {
    return typeof value === "function";
};