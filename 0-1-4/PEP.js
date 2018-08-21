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
        super();

        try { // argument validation

        } catch (err) {
            this.throw('constructor', err);
        }

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
        /**
         * TODO
         * es kann sein, dass das hier überhaupt nicht funktioniert,
         * da so zB am expressRouter keine actionen definiert werden können.
         * Und überhaupt, vllt ist dies auch die falsche Stelle.
         * Aktionen müssen so auch für jeden PEP definiert werden,
         * vllt sind diese allerdings eher spezifisch/relevant für den PDP,
         * bzw PIP oder policyStore und attributeStore
         */

        try { // validate arguments
            V8n().string().check(actionName);
            V8n().function().check(actionCallback);
        } catch (err) {
            this.throw('defineAction', new TypeError("invalid arguments"));
        }

        if (this.data.actionCallbacks.has(actionName))
            this.throw('defineAction', `action '${actionName}' has already been defined`);

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