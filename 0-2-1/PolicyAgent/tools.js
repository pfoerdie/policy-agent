const
    Assert = require('assert'),
    UUID = require('uuid/v4');

module.exports = {

    define: (obj, key, val) =>
        Object.defineProperty(obj, key, { value: val }),

    defineGetter: (obj, key, getter) =>
        Object.defineProperty(obj, key, { get: getter }),

    enumerate: (obj, key, val) =>
        Object.defineProperty(obj, key, { value: val, enumerable: true }),

    hrt: Date.now,
    uuid: UUID,
    assert: Assert

}; // module.exports