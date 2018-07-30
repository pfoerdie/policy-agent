/**
 * @module PolicyAgent~Context
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    UUID = require('uuid/v4');

/**
 * @name Context
 * @package
 */
class Context {
    /**
     * @constructs Context
     * @param {(Session|object)} session The session from which the context was created.
     * @param {{action: string, target: JSON, assignee: (JSON|undefined), assigner: (JSON|undefined)}} param The parametrization for the context.
     */
    constructor(session, param) {

        Object.defineProperties(this, {
            param: {
                value: Object.create({}, {
                    id: {
                        value: UUID()
                    },
                    session: {
                        value: Utility.validParam('object', session)
                    },
                    action: {
                        value: Utility.validParam('string', param['action'], session['action'])
                    },
                    target: {
                        value: Utility.validParam('object', param['target'], session['target'])
                    },
                    assignee: {
                        value: Utility.validParam('object', param['assignee'], session['assignee'], null)
                    },
                    assigner: {
                        value: Utility.validParam('object', param['assigner'], session['assigner'], null)
                    },
                    consoleOutput: {
                        writable: true,
                        value: false
                    }
                })
            },
            data: {
                enumerable: true,
                value: Object.create({}, {
                    odrlRequest: { // vllt in odrl umbenennen
                        value: {
                            action: null,
                            target: null,
                            assignee: null,
                            assigner: null
                        }
                    },
                    requestCache: { // TODO vllt in cache umbenennen
                        value: new Map()
                    },
                    result: {
                        value: {}
                    },
                    audits: {
                        value: []
                    }
                })
            }
        });

        this.param.session.touch();

        this.log(`context constructed @${Utility.toStringColorScheme('Session', this.param.session.id)}`);
    } // Context#constructor

    /**
     * @function Context#_audit
     * @param {string} topic The topic for the arguments.
     * @param {...*} args The arguments that should be audited.
     * @returns {undefined}
     * @package
     */
    _audit(topic, ...args) {
        if (typeof topic !== 'string')
            throw new Error(this.toString('_audit', 'topic, ...args', `topic has to be a string`));

        topic = topic.toLowerCase();

        let entry = [topic, Date.now(), ...args];

        if (this.param.consoleOutput) {
            // console.info(Utility.toStringColorScheme('Audit', null, entry[0], null, args.join(" | "), entry[1])); // short
            console.info(this.toString('_audit', `type = ${entry[0]}`, args.join(" | "), entry[1])); // complete
        }

        this.data.audits.push(entry);
    } // Context#_audit

    /**
     * Sends a log message to the contexts audit function.
     * @name Context#log
     * @param {string} message The log message.
     * @returns {undefined}
     * @public
     */
    log(message) {
        if (typeof message !== 'string')
            throw new Error(this.toString('log', 'message', `message has to be a string`));

        this._audit('log', message);
    } // Context#log

    /**
     * Replaces the nativ string representation of an object by a simple string notation of the context.
     * @name Context#toString
     * @returns {string} String notation for the context.
     * @package
     * @override
     */
    toString(...args) {
        return Utility.toStringColorScheme('Context', this.param.id, ...args);
    } // Context#toString

} // Context

Utility.getPublicClass(Context);
module.exports = Context;