const
    _ = require("./tools.js"),
    _module = require("./package.js"),
    Context = require("./Context.js");

let
    _types = new Map();

_.define(exports, '_cacheEntities', async function (context) {
    _.assert(context instanceof Context, "invalid context");
    _.assert(context.phase === 'cache_entities');
    // TODO
}); // PIP._cacheEntities

_.define(exports, '_getInformation', async function () {
    // TODO
}); // PIP._getInformation

_.define(exports, 'registerType', function (type, constructor) {
    _.assert(type && typeof type === 'string');
    _.assert(typeof constructor === 'function');
    _.assert(!_types.has(type), "type already registered");
    _types.set(type, callback);
}); // PIP.registerType