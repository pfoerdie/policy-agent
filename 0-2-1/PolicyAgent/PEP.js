const
    _ = require("./tools.js"),
    _module = require("./index.js"),
    Context = require("./Context.js");

_.enumerate(exports, 'request', async function (param = {}) {
    let context = new Context();

    await context.exec({
        action: param['action'] || null,
        target: param['target'] || null,
        assignee: param['assignee'] || null
    });

    console.log(`Context<${context.id}>\nexecution time: ${context.lifetime}ms\n`);

    if (context.phase === 'error') throw context.error;
    else if (context.phase === 'success') return context.result;
}); // PEP.request

_.define(exports, '_makeRequest', function (context, request) {
    _.assert(context instanceof Context, "invalid context");
    _.enumerate(request, 'id', _.uuid());
    if (context.phase === 'make_request')
        _.define(context, 'mainRequest', request.id);
    context.requests.push(request);
}); // PEP._makeRequest