const
    _module = require("./index.js"),
    Context = require("./Context.js"),
    T = require("./tools.js");

T.enumerate(exports, 'request', async function (param = {}) {
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

T.define(exports, '_makeRequest', function (context, request) {
    T.assert(context instanceof Context, "invalid context");
    T.assert.equal(context.phase, 'make_request');
    // TODO
}); // PEP._makeRequest