/**
 * @module PolicyAgent~PolicyPoint
 * @author Simon Petrac
 */


const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    UUID = require('uuid/v4');

/**
 * This is the base class for all policy points.
 * @name PolicyPoint
 * @abstract
 * @package
 */
class PolicyPoint {

    /**
     * @constructs PolicyPoint
     * @param {string} type The type of policy point that the inheriting class is.
     */
    constructor(type) {
        if (new.target === PolicyPoint)
            throw new Error(`PolicyPoint#constructor(type) -> the PolicyPoint is an abstract class`);
        if (typeof type !== 'string')
            throw new Error(`PolicyPoint#constructor(type) -> type has to be a string`);

        Object.defineProperties(this, {
            /** 
             * An object that represents all parametrization of the policy point.
             * @name PolicyPoint#param
             * @type {object}
             */
            param: {
                enumerable: true,
                value: Object.create({}, {
                    /**
                     * A generated uuid-v4 for the policy point.
                     * @name PolicyPoint#param.id
                     * @type {UUID}
                     */
                    id: {
                        enumerable: true,
                        value: UUID()
                    },
                    /**
                     * Type of the policy point, e.g. PEP, PDP etc.
                     * @name PolicyPoint#param.type
                     * @type {string}
                     */
                    type: {
                        enumerable: true,
                        value: type
                    }
                })
            },
            /** 
             * An object that represents all generated data of the policy point.
             * @name PolicyPoint#data
             * @type {object}
             */
            data: {
                enumerable: true,
                value: {}
            }
        });

    } // PolicyPoint#constructor

    /**
     * The id of the policy point.
     * @name PolicyPoint#id
     * @type {UUID}
     * @public
     */
    get id() {
        return this.param.id;
    } // PolicyPoint#id<getter>

    /**
     * Indicates whether the instance is ready or not.
     * @name PolicyPoint#ready
     * @type {boolean}
     * @public
     */
    get ready() {
        return true;
    } // PolicyPoint#ready<getter>

    /**
     * Replaces the nativ string representation of an object by a simple string notation of the policy point.
     * @name PolicyPoint#toString
     * @returns {string} String notation for the policy point.
     * @package
     * @override
     */
    toString(...args) {
        return Utility.toStringColorScheme(this.param.type, this.param.id, ...args);
    } // PolicyPoint#toString

} // PolicyPoint

module.exports = PolicyPoint;