const
    UUID = require('uuid/v4');

exports.hrt = Date.now;
exports.uuid = UUID;

exports.set = function (obj, key, value) {
    let writable = true;
    Object.defineProperty(obj, key, { value, writable });
}

exports.define = function (obj, key, value, get, set) {
    Object.defineProperty(obj, key, (get || set) ? { get, set } : { value });
};

exports.enumerate = function (obj, key, value, get, set) {
    let enumerable = true;
    Object.defineProperty(obj, key, (get || set) ? { get, set, enumerable } : { value, enumerable });
};

exports.is = {
    number(value) {
        return typeof value === 'number' && !isNaN(value) && value < Infinity && value > -Infinity;
    },
    string(value) {
        return typeof value === 'string';
    },
    function(value) {
        return typeof value === 'function'
    },
    array(value) {
        return Array.isArray(value);
    },
    object(value) {
        return value && typeof value == 'object';
    }
};

exports.assert = function assert(value, errMsg, errType = Error) {
    if (!value) {
        let err = errMsg instanceof Error ? errMsg : new errType(errMsg);
        Error.captureStackTrace(err, assert);
        throw err;
    }
};

exports.assert.number = function (value, errMsg) {
    return exports.assert(exports.is.number(value), errMsg, TypeError);
}

exports.assert.string = function (value, errMsg) {
    return exports.assert(exports.is.string(value), errMsg, TypeError);
}

exports.assert.function = function (value, errMsg) {
    return exports.assert(exports.is.function(value), errMsg, TypeError);
}

exports.assert.object = function (value, errMsg) {
    return exports.assert(exports.is.object(value), errMsg, TypeError);
}

exports.normalizeStr = function (str) {
    return str
        .replace(/^\s*\/\/.*\n/mg, "") // remove comments
        .replace(/\s+/g, " ") // shrink whitespaces
        .trim();
};