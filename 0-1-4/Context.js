/**
 * @module PolicyAgent~Context
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    V8n = require('v8n');

/**
 * NOTE XACML Request Attributes:
 * - Resource    => Data, service or system component
 *      -> Session
 *      -> Cache?
 *      -> additional data for the request
 * 
 * - Action      => An operation on a resource
 *      -> die tatsächlichen Funktionen, die innerhalb eines Contexts aufgerufen werden können
 * 
 * - Environment => The set of attributes that are relevant to an authorization decision and are independent of a 
 *                  particular subject, resource or action
 *      -> DateTime
 * 
 * - Subject     => An actor whose attributes may be referenced by a predicate
 *      -> ODRL~Rule#action                                 <- ODRL~Action
 *      -> ODRL~Rule#relation (e.g. target)                 <- ODRL~Asset
 *      -> ODRL~Rule#function (e.g. assigner, assignee)     <- ODRL~Party
 * 
 *(- )
 */

/**
 * @name Context
 * @extends PolicyAgent~SystemComponent
 * TODO vllt sollte der Context keine SystemComponent sein
 */
class Context extends SystemComponent {
    /**
     * @constructs Context
     * @param {(Session|object)} session The session from which the context was created.
     * @param {JSON} param The parametrization for the context.
     * @package
     */
    constructor(session, param) {
        super();

        try { // argument validation
            V8n().object().check(session);
            V8n().JSON().check(param);
        } catch (err) {
            this.throw('constructor', err);
        }

        /**
         * @name Context#data
         * @property {object} subject
         * NOTE XACML request.subject
         * -> An actor whose attributes may be referenced by a predicate
         *    (Predicate := A statement about attributes whose truth can be evaluated)
         * @property {object} resource
         * NOTE XACML request.resource
         * -> Data, service or system component
         * @property {object} environment
         * 
         * NOTE XACML request.environment
         * -> The set of attributes that are relevant to an authorization decision 
         *    and are independent of a particular subject, resource or action
         * @property {object} action
         * NOTE XACML request.action
         * -> An operation on a resource
         */
        Object.defineProperties(this.data, {
            subject: {
                value: {}
            },
            resource: {
                value: {}
            },
            environment: {
                value: {}
            },
            action: {
                value: {}
            }
        }); // Context#data

        /**
         * @name Context#data.subject
         * @property {*} action 
         * @property {*} relation
         * @property {*} function
         * TODO jsDoc
         */
        Object.defineProperties(this.data.subject, { // TODO
            action: {
                value: null
            },
            relation: {
                value: null
            },
            function: {
                value: null
            }
        }); // Context#data.subject

        /**
         * @name Context#data.resource
         * @property {Session} session
         * @property {Map} cache
         */
        Object.defineProperties(this.data.resource, {
            session: {
                value: session
            },
            cache: {
                value: new Map()
            }
        }); // Context#data.resource

        /**
         * @name Context#data.environment
         * @property {number} timestamp
         */
        Object.defineProperties(this.data.environment, {
            timestamp: {
                value: Date.now()
            }
        }); // Context#data.environment

    } // Context#constructor

} // Context

module.exports = Context;