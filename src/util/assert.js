const _ = require(".");
module.exports = assert;

function assert(value, errMsg, errType = Error) {
    if (!value) {
        let err = (errMsg instanceof Error) ? errMsg : null;
        if (!err) {
            err = new errType(errMsg);
            Error.captureStackTrace(err, assert);
        }
        throw err;
    }
}

assert.number = function (value, min = -Infinity, max = Infinity) {
    if (!(_.is.number(value) && value >= min && value <= max)) {
        err = new TypeError("not a valid number");
        Error.captureStackTrace(err, assert.number);
        throw err;
    }
};

assert.string = function (value, minLength = 0, maxLength = Infinity) {
    if (!(_.is.string(value) && value.length >= minLength && value.length <= maxLength)) {
        err = new TypeError("not a valid string");
        Error.captureStackTrace(err, assert.string);
        throw err;
    }
};

assert.function = function (value) {
    if (!(_.is.function(value))) {
        err = new TypeError("not a valid function");
        Error.captureStackTrace(err, assert.function);
        throw err;
    }
};

assert.array = function (value, minLength = 0, maxLength = Infinity) {
    if (!(_.is.Array(value) && value.length >= minLength && value.length <= maxLength)) {
        err = new TypeError("not a valid array");
        Error.captureStackTrace(err, assert.array);
        throw err;
    }
};

assert.object = function (value, notNull = false) {
    if (!(notNull ? _.is.object.notnull(value) : _.is.object(value))) {
        err = new TypeError("not a valid object");
        Error.captureStackTrace(err, assert.object);
        throw err;
    }
};

assert.instance = function (value, validClass = false) {
    if (!(validClass === true ? _.is.Object(value)
        : validClass === false ? _.is.object(value) && _.is.Object(value)
            : value instanceof validClass
    )) {
        err = new TypeError("not a valid instance");
        Error.captureStackTrace(err, assert.instance);
        throw err;
    }
};