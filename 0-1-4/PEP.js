/**
 * @module PolicyAgent~PEP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    Context = require(Path.join(__dirname, "Context.js")),
    PDP = require(Path.join(__dirname, "PDP.js")),
    V8n = require('v8n');

/**
 * Policy Execution Point
 * @name PEP
 * @extends PolicyAgent~SystemComponent
 */
class PEP extends SystemComponent {
    /**
     * @constructs PEP
     * @public
     */
    constructor() {
        super('PEP');

        if (V8n().not.arrSchema([
            // TODO
        ]).test(arguments)) {
            this.throw('constructor', new TypeError(`invalid arguments`));
        } // argument validation

        Object.defineProperties(this.data, {
            actionCallbacks: {
                value: new Map()
            }
        });
    } // PEP#constructor

    /**
     * Creates a context and sends a request to the connected PDPs.
     * @name PEP#request
     * @param {(Session|PolicyAgent~Context)} session The session for the context. If session is a Context itself, the session will be inherited.
     * @param {JSON} param The parametrization for the context.
     * @returns {object} The result of the created context.
     * @async
     * @public
     */
    async request(session, param) {
        if (V8n().ofClass(Context).test(session))
            session = session.session;

        if (V8n().not.arrSchema([
            V8n().object(), // session
            V8n().JSON() // param
        ]).test(arguments)) {
            this.throw('request', new TypeError(`invalid arguments`));
        } // argument validation

        let context = new Context(session, param);
        context.log('constructor', `initialized by ${this.toString()}`);

        // TODO
    } // PEP#request

    /**
     * Defines an action for beeing executed, if a request is successful.
     * @name PEP#defineAction
     * @param {string} actionName Name of the action.
     * @param {function} actionCallback Callback for the action.
     */
    defineAction(actionName, actionCallback) {
        if (V8n().not.arrSchema([
            V8n().string(), // actionName
            V8n().function() // actionCallback
        ]).test(arguments)) {
            this.throw('defineAction', new TypeError(`invalid arguments`));
        } // argument validation

        if (this.data.actionCallbacks.has(actionName))
            this.throw('defineAction', `action '${actionName}' already defined`);

        this.data.actionCallbacks.set(actionName, actionCallback);
    } // PEP#defineAction

    /**
     * @name PEP.express
     * @param {PEP} [pep]
     * @returns {express~Router}
     * @static
     * TODO vllt so, vllt anders. Aber irgendwie muss ein vorhandener PEP übergeben werden können
     *      (gilt für alle statischen Methoden, die einen PEP erzeugen)
     */
    static express(pep) {
        // TODO implementieren
    } // PEP.express

    static socketIO() {
        // TODO implementieren
    } // PEP.socketIO

} // PEP

module.exports = PEP;