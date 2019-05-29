const
    Assert = require('assert'),
    Context = require("./Context.js"),
    _module = require("./index.js"),
    T = require("./tools.js"),
    PEP = {};

T.enumerate(PEP, 'request', async function (param = {}) {
    let context = new Context();

    await context.exec({
        action: param['action'] || null,
        target: param['target'] || null,
        assignee: param['assignee'] || null
    });

    console.log(`Context<${context.id}>\nexecution time: ${context.tse - context.tss}ms\n`);

    if (context.phase === 'error') throw context.error;
    else if (context.phase === 'success') return context.result;
}); // PEP.request

T.define(PEP, '_makeRequest', function (context, request) {
    Assert(context instanceof Context, "invalid context");
    Assert.equal(context.phase, 'make_request');
    // TODO
}); // PEP._makeRequest

module.exports = PEP;