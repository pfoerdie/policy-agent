/**
 * @module PolicyAgent~Context
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    V8n = require('v8n');

/**
 * @name Context
 * @extends PolicyAgent~SystemComponent
 */
class Context extends SystemComponent {
    /**
     * @constructs Context
     * @param {(Session|object)} session The session from which the context was created.
     * @param {JSON} param The parametrization for the context.
     * @param {PolicyAgent~PEP} enforcementPoint
     * @param {PolicyAgent~PDP} decisionPoint
     * @param {PolicyAgent~PEP} [executionPoint]
     * @package
     */
    constructor(session, param, enforcementPoint, decisionPoint, executionPoint) {
        super('Context');

        if (V8n().not.arrSchema([
            V8n().object(), // session
            V8n().JSON(), // param
            V8n().componentType('PEP'), // enforcementPoint
            V8n().componentType('PDP'), // decisionPoint
            V8n().optional(V8n().componentType('PEP')) // executionPoint
        ]).test(arguments)) {
            this.throw('constructor', new TypeError(`invalid arguments`));
        } // argument validation

        /**
         * @name Context#data
         * @property {object} subject
         * NOTE XACML request.subject:
         * -> An actor whose attributes may be referenced by a predicate
         *    (Predicate := A statement about attributes whose truth can be evaluated)
         * @property {object} resource
         * NOTE XACML request.resource:
         * -> Data, service or system component
         * @property {object} environment
         * 
         * NOTE XACML request.environment:
         * -> The set of attributes that are relevant to an authorization decision 
         *    and are independent of a particular subject, resource or action
         * @property {object} action
         * NOTE XACML request.action:
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
         * 
         * - originator/addressor/despatcher
         * - intermediary
         * - recipient
         * 
         * -> relay / relais
         * -> interstation / station
         * -> stage
         */
        Object.defineProperties(this.data.resource, {
            session: {
                value: session
            },
            cache: {
                value: new Map()
            },
            stage: {
                value: Object.create({}, {
                    enforcement: {
                        value: enforcementPoint
                    },
                    decision: {
                        value: decisionPoint
                    },
                    execution: {
                        value: executionPoint ? executionPoint : enforcementPoint
                    }
                })
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