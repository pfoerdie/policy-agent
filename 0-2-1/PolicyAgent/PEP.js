const
    Assert = require('assert'),
    Context = require("./Context.js"),
    PRP = require("./PRP.js"),
    T = require("./tools.js"),
    PEP = {};

T.enumerate(PEP, 'request', async function (param) {
    let context = new Context();
    await context.exec({ /* request */ });
    // TODO
}); // PEP.request

T.define(PEP, '_makeRequests', function (context, request) {
    Assert(context instanceof Context, "invalid context");
    // TODO
}); // PEP._makeRequests

module.exports = PEP;