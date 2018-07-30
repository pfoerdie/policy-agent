/**
 * @module PolicyAgent~PAP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    PolicyPoint = require(Path.join(__dirname, "PolicyPoint.js"));

/**
 * @name PAP
 */
class PAP extends PolicyPoint {

    constructor(policyStore) {

        super('PAP');

        // TODO PAP

    } // PAP#constructor

    /**
     * @name PAP#ready
     * @inheritdoc
     */
    get ready() {
        return super.ready;
    } // PAP#ready<getter>

} // PAP

Utility.getPublicClass(PAP);
module.exports = PAP;