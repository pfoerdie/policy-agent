const
    _types = new Map(),
    _subClasses = new Map(),
    _private = new WeakMap(),
    _define = (obj, key, val) => Object.defineProperty(obj, key, { value: val }),
    _enumerate = (obj, key, val) => Object.defineProperty(obj, key, { value: val, enumerable: true });

class Asset {

    /**
     * @param {*} [data=null]
     */
    constructor(data = null) { // argumente abschmecken -> die daten kommen direkt aus neo4j
        if (new.target === Asset)
            throw new Error("Asset is an abstract class.");
        if (!_subClasses.has(new.target))
            throw new Error("SubClasses have to be registered.");

        const _config = _private.get(_subClasses.get(new.target));
        const _attr = { data, ..._config };

        _private.set(this, _attr);
    } // Asset#constructor

    /**
     * @param {string} type 
     * @param {class} subClass 
     * @returns {class} subClass
     */
    static register(type, subClass) {
        if (!type || typeof type !== 'string')
            throw new TypeError("The type has to be a string.");
        if (!Asset.isPrototypeOf(subClass))
            throw new TypeError("Invalid subClass.");
        if (_types.has(type))
            throw new Error("The type has already been registered.");
        if (_subClasses.has(subClass))
            throw new Error("The subClass has already been registered.");

        for (let key of Reflect.ownKeys(subClass.prototype)) {
            if (key !== 'constructor') {
                let actionDef = subClass.prototype[key];
                // TODO
                if (actionDef.callback)
                    _define(subClass.prototype, key, (...args) => actionDef.callback(...args));
                else
                    delete subClass.prototype[key];
            }
        }

        Object.freeze(subClass.prototype);

        _types.set(type, subClass);
        _subClasses.set(subClass, this);

        return subClass;
    } // Asset.register

    static create(type, data) {
        if (!type || typeof type !== 'string')
            throw new TypeError("The type has to be a string.");
        if (!_types.has(type))
            throw new Error("Unknown type.");

        const subClass = _types.get(type);
        return new subClass(data);
    } // Asset.create

} // Asset

module.exports = Asset;