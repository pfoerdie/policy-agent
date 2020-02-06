/**
 * @module tools
 * @author Simon Petrac
 */

const Colors = require("colors");
const UUID = require("uuid/v4");

exports.uuid = UUID;

exports.set = function (obj, key, value) {
    const enumerable = true, writable = true;
    Object.defineProperty(obj, key, { value, enumerable, writable });
}; // exports.set

exports.define = function (obj, key, value, get, set) {
    Object.defineProperty(obj, key, (get || set) ? { get, set } : { value });
}; // exports.define

exports.enumerate = function (obj, key, value, get, set) {
    const enumerable = true;
    Object.defineProperty(obj, key, (get || set) ? { get, set, enumerable } : { value, enumerable });
}; // exports.enumerate

exports.assert = Object.assign(function assert(value, errMsg, errType = Error) {
    if (!value) {
        let err = (errMsg instanceof Error) ? errMsg : null;
        if (!err) {
            err = new errType(errMsg);
            Error.captureStackTrace(err, assert);
        }
        throw err;
    }
}, {
    number(value) {
        if (!exports.is.number(value)) {
            err = new TypeError("not a number");
            Error.captureStackTrace(err, exports.assert.number);
            throw err;
        }
    }, // exports.assert.number
    string(value) {
        if (!exports.is.string(value)) {
            err = new TypeError("not a string");
            Error.captureStackTrace(err, exports.assert.string);
            throw err;
        }
    }, // exports.assert.string
    String(value) {
        if (!exports.is.string(value, 1)) {
            err = new TypeError("not a non empty string");
            Error.captureStackTrace(err, exports.assert.String);
            throw err;
        }
    }, // exports.assert.String
    function(value) {
        if (!exports.is.function(value)) {
            err = new TypeError("not a function");
            Error.captureStackTrace(err, exports.assert.function);
            throw err;
        }
    }, // exports.assert.function
    array(value) {
        if (!exports.is.array(value)) {
            err = new TypeError("not an array");
            Error.captureStackTrace(err, exports.assert.array);
            throw err;
        }
    }, // exports.assert.array
    object(value) {
        if (!exports.is.object(value)) {
            err = new TypeError("not an object");
            Error.captureStackTrace(err, exports.assert.object);
            throw err;
        }
    }, // exports.assert.object
    Object(value) {
        if (!exports.is.object(value, true)) {
            err = new TypeError("not a non null object");
            Error.captureStackTrace(err, exports.assert.Object);
            throw err;
        }
    } // exports.assert.Object
}); // exports.assert

exports.is = {
    number: function (value, min = -Infinity, max = Infinity) {
        return typeof value === 'number' && !isNaN(value) && value >= min && value <= max;
    },
    string: function (value, minLength = 0, maxLength = Infinity) {
        return typeof value === 'string' && value.length >= minLength && value.length <= maxLength;
    },
    function: function (value) {
        return typeof value === 'function';
    },
    array: function (value, minLength = 0, maxLength = Infinity) {
        return Array.isArray(value) && value.length >= minLength && value <= maxLength;
    },
    object: function (value, notNull = false) {
        return typeof value == 'object' && !notNull === !value;
    }
}; // exports.is

let logCount = 0, logSilent = false, logColored = true;
exports.log = function log(scope, method, ...args) {
    let raw = "", color = "";

    if (typeof scope === "string") {
        raw = scope;
        color = Colors.yellow(scope);
    } else if (scope instanceof Object && typeof method === "string" && Reflect.has(scope, method)) {
        let scopeName = typeof scope === "function" ? scope.name : scope.__proto__.constructor.name;
        let scopeData = typeof scope.id === "string" ? scope.id : JSON.stringify(scope.data) || "";
        let argPairs = args.map(arg => [
            arg === undefined ? "undefined" : arg === null ? "null" : arg.__proto__.constructor.name,
            !arg ? "" : exports.is.string(arg.id, 1) ? arg.id : JSON.stringify(arg.data) || ""
        ]);

        raw = `${scopeName}<${scopeData}>.${method}(${argPairs.map(([argName, argData]) => `${argName}<${argData}>`).join(", ")})`;
        color = Colors.cyan(scopeName) + Colors.grey("<") + Colors.green(scopeData) + Colors.grey(">")
            + Colors.grey(".") + Colors.magenta(method) + Colors.grey("(")
            + argPairs.map(([argName, argData]) =>
                Colors.blue(argName) + (argData ? Colors.grey("<") + Colors.green(argData) + Colors.grey(">") : "")
            ).join(Colors.grey(", "))
            + Colors.grey(")");
    } else {
        return null;
    }

    raw = `log[${logCount}]: ` + raw;
    color = Colors.grey(`log[${logCount}]: `) + color;
    logCount++;

    if (!logSilent) console.log(logColored ? color : raw);
    return raw;
}; // exports.log