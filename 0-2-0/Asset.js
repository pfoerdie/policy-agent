const
    _types = new Map(),
    _subClasses = new Map(),
    _private = new WeakMap();

/**
 * @this {Asset}
 * @returns {*}
 */
function _actionUse() {
    return _private.get(this).data;
} // _actionUse

/**
 * @this {Asset}
 * @returns {*}
 */
function _actionTransfer() {
    throw new Error("Not supported yet.");
} // _actionTransfer

class AssetSetup {

    /**
     * @param {string} type 
     * @param {class} subClass 
     */
    constructor(type, subClass) {
        if (_types.has(type))
            throw new Error("The type already exists.");
        if (_subClasses.has(subClass))
            throw new Error("The subClass already exists.");

        _types.set(type, subClass);
        _subClasses.set(subClass, this);
        _private.set(this, {
            actions: new Map(),
            callbacks: new WeakSet()
        });

        this.defineAction('use', _actionUse);
        this.defineAction('transfer', _actionTransfer);
    } // AssetSetup#constructor

    /**
     * @param {string} actionID 
     * @param {function} callback 
     * @param {string} includedIn 
     * @param {string[]} implies 
     * @returns {AssetSetup}
     */
    defineAction(actionID, callback, includedIn, implies = []) {
        if (!actionID || typeof actionID !== 'string')
            throw new TypeError("The actionID has to be a string.");
        if (typeof callback !== 'function')
            throw new TypeError("The callback has to be a function.");
        if (actionID !== 'use' && actionID !== 'transfer' && (!includedIn || typeof includedIn !== 'string'))
            throw new TypeError("The includedIn has to be a string.");
        if (!Array.isArray(implies) || implies.some(elem => typeof elem !== 'string'))
            throw new TypeError("The implies has to be a string array.");

        const _config = _private.get(this);

        if (_config.actions.has(actionID))
            throw new Error("ActionID already in use.");
        if (_config.callbacks.has(callback))
            throw new Error("Callback already in use.");
        if (actionID !== 'use' && actionID !== 'transfer' && !_config.actions.has(includedIn))
            throw new Error("Unknown includedIn.");
        if (!implies.every(elem => _config.actions.has(elem)))
            throw new Error("Unknown implies.");

        _config.actions.set(actionID, {
            id: actionID,
            includedIn, implies,
            callback
        });
        _config.callbacks.add(callback);

        return this;
    } // AssetSetup#defineAction

} // AssetSetup

class Asset {

    /**
     * @typedef {Object} PrivateAttr
     * @property {Map} actions
     */

    /**
     * @param {*} [data=null]
     */
    constructor(uid, data = null) {
        if (new.target === Asset)
            throw new Error("Asset is an abstract class.");
        if (!_subClasses.has(new.target))
            throw new Error("SubClasses have to be registered.");
        if (!uid || typeof uid !== 'string')
            throw new TypeError("The uid has to be a string.");

        const _config = _private.get(_subClasses.get(new.target));

        /** @type {PrivateAttr} */
        const _attr = {
            data,
            ..._config
        };

        _private.set(this, _attr);
    } // Asset#constructor

    async request(actionID, ...args) {
        if (!actionID || typeof actionID !== 'string')
            throw new TypeError("The actionID has to be a string.");

        const _attr = _private.get(this);
        const _action = _attr.actions.get(actionID);

        if (!_action)
            throw new Error("ActionID unknown.");

        return await _action.callback.call( // TODO die optimalen variablen und scope für den aufruf finden
            _action.includedIn
                ? await this.request(_action.includedIn, ...args)
                : this,
            ...args
        );
    } // Asset#request

    /**
     * @param {string} type 
     * @param {class} subClass 
     * @returns {AssetSetup}
     */
    static register(type, subClass) {
        if (!type || typeof type !== 'string')
            throw new TypeError("The type has to be a string.");
        if (!Asset.isPrototypeOf(subClass))
            throw new TypeError("Invalid subClass.");

        return new AssetSetup(type, subClass);
    } // Asset.register

    static create(type, uid, data) {
        if (!type || typeof type !== 'string')
            throw new TypeError("The type has to be a string.");
        if (!_types.has(type))
            throw new Error("Unknown type.");

        const subClass = _types.get(type);
        return new subClass(uid, data);
    } // Asset.create

} // Asset

module.exports = Asset;