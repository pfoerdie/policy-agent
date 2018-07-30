/**
 * @module PEP
 * @author Simon Petrac
 */

/**
 * @name PEP
 */
class PEP {

    constructor(...args) {
        this.args = args;
    } // PEP#constructor

    get argsGetter() {
        return this.args;
    }

    get _packageGetter() {
        return "_packageGetter";
    }

    get publicGetter() {
        return "publicGetter";
    }

    _packageMethod() {
        return "_packageMethod";
    }

    publicMethod(testPEP) {
        console.warn(`publicMethod(testPEP) -> testPEP is${testPEP instanceof PEP ? " " : " not "}a private PEP`);
        return testPEP;
    }

    static _staticPackageMethod() {
        return "_staticPackageMethod";
    }

    static staticPublicMethod() {
        return "staticPublicMethod";
    }

} // PEP

module.exports = PEP;