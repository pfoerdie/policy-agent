/**
 * @module PolicyAgent~PXP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    PolicyPoint = require(Path.join(__dirname, "PolicyPoint.js"));

/**
 * @name PXP
 */
class PXP extends PolicyPoint {

    constructor(policyStore, attributeStore) {

        super('PXP');

        // TODO PXP

    } // PXP#constructor

    /**
     * @name PXP#ready
     * @inheritdoc
     */
    get ready() {
        return super.ready;
    } // PXP#ready<getter>

} // PXP

Utility.getPublicClass(PXP);
module.exports = PXP;