const { util: _ } = $ = require("./index.js");
_.cache.put(exports, {
    driver: null
});
exports.connect = require("./repo/connect.js");
exports.query = require("./repo/query.js");
Object.freeze(exports);