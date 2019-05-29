const
    Assert = require('assert'),
    Context = require("./Context.js"),
    _module = require("./index.js"),
    T = require("./tools.js"),
    PIP = {};

T.define(PIP, '_cacheEntities', async function (context) {
    Assert(context instanceof Context, "invalid context");
    Assert.equal(context.phase, 'cache_entities');
    // TODO
}); // PIP._cacheEntities

T.define(PIP, '_getInformation', async function () {
    // TODO
}); // PIP._getInformation

module.exports = PIP;