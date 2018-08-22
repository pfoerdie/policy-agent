/**
 * @module PolicyAgent.PEP
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
 * @extends PolicyAgent.SystemComponent
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
            },
            decisionPoints: {
                value: new Set()
            }
        });
    } // PEP#constructor

    /**
     * Creates a context and sends a request to the connected PDPs.
     * @name PEP#request
     * @param {(Session|PolicyAgent.Context)} session The session for the context. If session is a Context itself, the session will be inherited.
     * @param {JSON} param The parametrization for the context.
     * @returns {object} The result of the created context.
     * @async
     * @public
     * TODO was passiert mit dem result und dem context danach?
     * TODO return
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

        for (let decisionPoint of this.data.decisionPoints) {
            let context = new Context(session, param, this, decisionPoint);
            context.log('constructor', `initialized by ${this.toString()}`);

            let result = await context._requestDecision();
            console.log(result);
        }
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
     * Adds a PDP to resolve decision request.
     * @name PEP#connectPDP
     * @param {PolicyAgent.PDP} decisionPoint 
     */
    connectPDP(decisionPoint) {
        if (V8n().not.arrSchema([
            V8n().componentType('PDP') // decisionPoint
        ]).test(arguments)) {
            this.throw('connectPDP', new TypeError(`invalid arguments`));
        } // argument validation

        if (this.data.decisionPoints.has(decisionPoint))
            this.throw('connectPDP', new Error(`decisionPoint already connected`));

        this.data.decisionPoints.add(decisionPoint);
    } // PEP#connectPDP

    /**
     * @name PEP.express
     * @param {PEP} [enforcementPoint]
     * @returns {express~Router}
     * @static
     * TODO vllt so, vllt anders. Aber irgendwie muss ein vorhandener PEP übergeben werden können
     *      (gilt für alle statischen Methoden, die einen PEP erzeugen)
     * TODO implementieren
     */
    static express(enforcementPoint) {
    } // PEP.express

    /**
     * TODO jsDoc
     * TODO implementieren
     */
    static socketIO() {
    } // PEP.socketIO

} // PEP

module.exports = PEP;