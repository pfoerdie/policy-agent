const
    _module = require("./index.js"),
    Context = require("./Context.js"),
    T = require("./tools.js");

T.define(exports, '_cacheEntities', async function (context) {
    T.assert(context instanceof Context, "invalid context");
    T.assert.equal(context.phase, 'cache_entities');
    // TODO
}); // PIP._cacheEntities

T.define(exports, '_getInformation', async function () {
    // TODO
}); // PIP._getInformation