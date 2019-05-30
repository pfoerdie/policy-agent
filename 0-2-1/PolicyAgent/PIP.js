const
    _ = require("./tools.js"),
    _module = require("./index.js"),
    Context = require("./Context.js");

_.define(exports, '_cacheEntities', async function (context) {
    _.assert(context instanceof Context, "invalid context");
    _.assert.equal(context.phase, 'cache_entities');
    // TODO
}); // PIP._cacheEntities

_.define(exports, '_getInformation', async function () {
    // TODO
}); // PIP._getInformation