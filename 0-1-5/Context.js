/**
 * @module PolicyAgent.Context
 * @author Simon Petrac
 */

const
    V8n = require('v8n'),
    PolicyPoint = require('./PolicyPoint.js');

/**
 * @name Context
 */
class Context {
    /**
     * @constructs Context
     * @package
     */
    constructor(session, options) { // TODO
        Object.defineProperties(this, {
            subject: {
                value: Object.create({}, {
                    action: {
                        value: null
                    },
                    relation: {
                        value: null
                    },
                    function: {
                        value: null
                    }
                })
            },
            resource: {
                value: Object.create({}, {
                    session: {
                        value: session
                    },
                    cache: {
                        value: new Map()
                    },
                    stage: {
                        value: Object.create({}, {
                            enforcement: {
                                value: null
                            },
                            decision: {
                                value: null
                            },
                            information: {
                                value: null
                            },
                            execution: {
                                value: null
                            }
                        })
                    }
                })
            },
            environment: {
                value: Object.create({}, {
                    timestamp: {
                        value: Date.now()
                    }
                })
            },
            action: {
                value: Object.create({}, {

                })
            }
        });

    } // Context#constructor

} // Context

module.exports = Context;