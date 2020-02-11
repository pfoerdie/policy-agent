/**
 * @module tools
 * @author Simon Petrac
 */

const Colors = require("colors");
const UUID = require("uuid/v4");
const _ = exports;

_.uuid = UUID;

_.set = function (obj, key, value) {
    const enumerable = true, writable = true;
    Object.defineProperty(obj, key, { value, enumerable, writable });
}; // _.set

_.define = function (obj, key, value, get, set) {
    Object.defineProperty(obj, key, (get || set) ? { get, set } : { value });
}; // _.define

_.enumerate = function (obj, key, value, get, set) {
    const enumerable = true;
    Object.defineProperty(obj, key, (get || set) ? { get, set, enumerable } : { value, enumerable });
}; // _.enumerate

_.assert = Object.assign(function assert(value, errMsg, errType = Error) {
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
        if (!_.is.number(value)) {
            err = new TypeError("not a number");
            Error.captureStackTrace(err, _.assert.number);
            throw err;
        }
    }, // _.assert.number
    string(value) {
        if (!_.is.string(value)) {
            err = new TypeError("not a string");
            Error.captureStackTrace(err, _.assert.string);
            throw err;
        }
    }, // _.assert.string
    String(value) {
        if (!_.is.string(value, 1)) {
            err = new TypeError("not a non empty string");
            Error.captureStackTrace(err, _.assert.String);
            throw err;
        }
    }, // _.assert.String
    function(value) {
        if (!_.is.function(value)) {
            err = new TypeError("not a function");
            Error.captureStackTrace(err, _.assert.function);
            throw err;
        }
    }, // _.assert.function
    array(value) {
        if (!_.is.array(value)) {
            err = new TypeError("not an array");
            Error.captureStackTrace(err, _.assert.array);
            throw err;
        }
    }, // _.assert.array
    object(value) {
        if (!_.is.object(value)) {
            err = new TypeError("not an object");
            Error.captureStackTrace(err, _.assert.object);
            throw err;
        }
    }, // _.assert.object
    Object(value) {
        if (!_.is.object(value, true)) {
            err = new TypeError("not a non null object");
            Error.captureStackTrace(err, _.assert.Object);
            throw err;
        }
    } // _.assert.Object
}); // _.assert

_.is = {
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
        return typeof value == 'object' && (!notNull || value);
    }
}; // _.is

let logCount = 0, logSilent = false, logColored = true, logDisabled = false;
_.log = function log(scope, method, ...args) {
    if (logDisabled) return;
    let raw = "", colored = "";

    if (typeof scope === "string") {
        raw = scope;
        colored = Colors.yellow(scope);
    } else if (scope instanceof Object) {
        let scopeName = scope.__proto__.constructor.name;
        let scopeData = typeof scope.id === "string" ? scope.id : JSON.stringify(scope.data) || "";

        if (scope instanceof Error) {
            raw = `${scopeName}<${scopeData}> ${scope.message}`;
            colored = Colors.red(scopeName) + Colors.grey("<") + Colors.green(scopeData) + Colors.grey("> ")
                + Colors.yellow(scope.message);
        } else if (_.is.string(method, 1) && Reflect.has(scope, method) && _.is.function(scope[method])) {
            let argPairs = args.map(arg => [
                arg === undefined ? "undefined" : arg === null ? "null" : arg.__proto__.constructor.name,
                !arg ? "" : _.is.string(arg.id, 1) ? arg.id : JSON.stringify(arg.data) || ""
            ]);

            raw = `${scopeName}<${scopeData}>.${method}(${argPairs.map(([argName, argData]) => argName + (argData ? `<${argData}>` : "")).join(", ")})`;
            colored = Colors.cyan(scopeName) + Colors.grey("<") + Colors.green(scopeData) + Colors.grey(">")
                + Colors.grey(".") + Colors.magenta(method) + Colors.grey("(")
                + argPairs.map(([argName, argData]) =>
                    Colors.blue(argName) + (argData ? Colors.grey("<") + Colors.green(argData) + Colors.grey(">") : "")
                ).join(Colors.grey(", "))
                + Colors.grey(")");
        } else if (!method) {
            let argPairs = Object.entries(Object.assign({}, scope)).map(([argName, argData]) => [argName, argData instanceof Object ? argData.__proto__.constructor.name : argData]);

            raw = `${scopeName}<${scopeData}> {${argPairs.map(([argName, argData]) => `${argName}: ${argData}`).join(", ")}}`;
            colored = Colors.cyan(scopeName) + Colors.grey("<") + Colors.green(scopeData) + Colors.grey(">")
                + Colors.grey(" {")
                + argPairs.map(([argName, argData]) =>
                    Colors.blue(argName) + Colors.grey(": ") + Colors.green(argData)
                ).join(Colors.grey(", "))
                + Colors.grey("}");
        } else {
            raw = "invalid scope";
            colored = Colors.red("invalid scope");
            debugger;
        }
    } else {
        raw = "invalid scope";
        colored = Colors.red("invalid scope");
        debugger;
    }

    raw = `log[${logCount}]: ` + raw;
    colored = Colors.grey(`log[${logCount}]: `) + colored;
    logCount++;

    if (!logSilent) console.log(logColored ? colored : raw);

    // debugger;
    return raw;
}; // _.log