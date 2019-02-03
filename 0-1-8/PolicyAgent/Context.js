/**
 * Context
 * @module PolicyAgent.Context
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    _namespace = require('./namespace.js'),
    _enumerate = (obj, key, value) => Object.defineProperty(obj, key, { enumerable: true, value: value });

/**
 * @name RequestContext
 * @class
 */
class RequestContext {
    /**
     * @constructs RequestContext
     * @param {PEP} source
     * @param {JSON} param
     * @param {Session} [session]
     * @private
     */
    constructor(source, param, session) {
        if (!(source instanceof _namespace.PEP))
            throw new TypeError(`invalid argument`);

        _enumerate(this, '@type', "RequestContext");
        _enumerate(this, '@id', UUID());
        _enumerate(this, 'request', {});
        // _enumerate(this, 'session', session.id);

        /* 1. - add default subjects */

        _enumerate(this, 'target', param['target']);
        if (param['assigner'] && typeof param['assigner']['@type'] === 'string')
            _enumerate(this, 'assigner', param['assigner']);
        else if (session && session['assigner'] && typeof session['assigner']['@type'] === 'string')
            _enumerate(this, 'assigner', session['assigner']);
        if (param['assignee'] && typeof param['assignee']['@type'] === 'string')
            _enumerate(this, 'assignee', param['assignee']);
        else if (session && session['assignee'] && typeof session['assignee']['@type'] === 'string')
            _enumerate(this, 'assignee', session['assignee']);

        /* 2. - add action requests */

        const addRequest = (action) => {
            const
                requestID = `${action}-${UUID()}`,
                actionDef = source.data.actionDefinition.get(action),
                request = {};

            _enumerate(request, 'id', requestID);
            _enumerate(request, 'action', actionDef.action);

            /**
             * NOTE
             * Wie schon unter PEP.defineAction beschrieben, sollte mit Hilfe der implies
             * ein festes Target definiert werden können. Dieses wird dann mithilfe von
             * | _enumerate(request, 'target', target)
             * angefügt.
             */

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
class ResponseContext {
    /**
     * @constructs ResponseContext
     * @param {PDP} source
     * @param {RequestContext} requestContext
     */
    constructor(source, requestContext) {
        if (!(source instanceof _namespace.PDP))
            throw new TypeError(`invalid argument`);
        if (!(requestContext instanceof RequestContext))
            throw new TypeError(`invalid argument`);

        _enumerate(this, '@type', "ResponseContext");
        _enumerate(this, 'id@', UUID());
        _enumerate(this, 'response', {});
        // _enumerate(this, 'session', requestContext['session']);
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

            _enumerate(response, 'includedIn', request['includedIn']);
            _enumerate(response, 'implies', request['implies'].map(val => val));

            _enumerate(this['response'], requestID, response);
        } // for

        _enumerate(this, 'entryPoint', requestContext['entryPoint']);

    } // ResponseContext.constructor

} // ResponseContext

exports.Request = RequestContext;
exports.Response = ResponseContext;