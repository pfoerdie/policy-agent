const { util: _ } = $ = require("./index.js");
_.cache.put(exports, {
    entities: new Map()
});
exports.Entity = require("./model/Entity.js");
exports.Asset = require("./model/Asset.js");
exports.AssetCollection = require("./model/AssetCollection.js");
Object.freeze(exports);
