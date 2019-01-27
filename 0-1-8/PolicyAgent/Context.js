/**
 * Context
 * @module PolicyAgent.Context
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    _namespace = require('.'),
    _enumerate = (obj, key, value) => Object.defineProperty(obj, key, { enumerable: true, value: value });

/**
 * @name RequestContext
 * @class
 */
class RequestContext extends Context {
    /**
     * @constructs RequestContext
     * @param {PEP} source
     * @param {Session} session
     * @param {JSON} param
     * @private
     */
    constructor(source, session, param) {
        if (!(source instanceof _namespace.PEP))
            throw new TypeError(`invalid argument`);

        // TODO alles durchgehen und überarbeiten!

        _enumerate(this, '@type', "RequestContext");
        _enumerate(this, '@id', UUID());
        _enumerate(this, 'request', {});

        /* 1. - add default subjects */

        _enumerate(this, 'target', param['target']);
        if (param['assigner'] && typeof param['assigner']['@type'] === 'string')
            _enumerate(this, 'assigner', param['assigner']);
        if (param['assignee'] && typeof param['assignee']['@type'] === 'string')
            _enumerate(this, 'assignee', param['assignee']);

        /* 2. - add action requests */

        const addRequest = (action) => {
            const
                requestID = `${action}-${UUID()}`,
                actionDef = source.data.actionDefinition.get(action),
                request = {};

            _enumerate(request, 'id', requestID);
            _enumerate(request, 'action', actionDef.action);

            // if (actionDef.target && param[actionDef.target] && typeof param[actionDef.target]['@type'] === 'string')
            //     _enumerate(request, 'target', param[actionDef.target]);
            // if (actionDef.assigner && param[actionDef.assigner] && typeof param[actionDef.assigner]['@type'] === 'string')
            //     _enumerate(request, 'assigner', param[actionDef.assigner]);
            // if (actionDef.assignee && param[actionDef.assignee] && typeof param[actionDef.assignee]['@type'] === 'string')
            //     _enumerate(request, 'assignee', param[actionDef.assignee]);

            _enumerate(this['request'], requestID, request);

            if (actionDef.includedIn)
                _enumerate(request, 'includedIn', addRequest(actionDef.includedIn));

            _enumerate(request, 'implies', actionDef.implies.map(impl => addRequest(impl)));

            return requestID;
        }; // addRequest

        let entryPoint = addRequest(param['action']);
        _enumerate(this, 'entryPoint', entryPoint);
    } // RequestContext.constructor

}; // RequestContext

/**
 * @name ResponseContext
 * @class
 */
class ResponseContext extends Context {
    /**
     * @constructs ResponseContext
     * @param {PDP} source
     * @param {RequestContext} requestContext
     */
    constructor(source, requestContext) {
        if (!(source instanceof _namespace.PEP))
            throw new TypeError(`invalid argument`);
        if (!(requestContext instanceof RequestContext))
            throw new TypeError(`invalid argument`);

        _enumerate(this, '@type', "ResponseContext");
        _enumerate(this, 'id@', UUID());
        _enumerate(this, 'response', {});
        _enumerate(this, 'subject', {});
        _enumerate(this, 'resource', {});
        _enumerate(this, 'environment', {});

        for (let requestID in requestContext['request']) {
            /* create response from each request */
            let
                request = requestContext['request'][requestID],
                response = {};

            _enumerate(response, 'id', requestID);
            _enumerate(response, 'action', request['action']);

            _enumerate(this['response'], requestID, response);
        } // for
    } // ResponseContext.constructor

} // ResponseContext

exports.Request = RequestContext;
exports.Response = ResponseContext;