/**
 * Policy Information Point
 * @module PolicyAgent.PIP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    PolicyPoint = require('./PolicyPoint.js'),
    SP = require('./SP.js'),
    RP = require('./RP.js');

//#region PIP

/**
 * @name PIP
 * @extends PolicyPoint
 */
class PIP extends PolicyPoint {
    /**
     * @constructs PIP
     * @param {JSON} [options={}]
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.SPs = new Map();
        this.data.RPs = new Map();

    } // PIP.constructor

    connectSP(SP) {
        if (!(SP instanceof SP))
            this.throw('connectSP', new TypeError(`invalid param`));

        this.data.SPs.set(Symbol(), SP);

        this.log('connectSP', `${SP.toString(undefined, true)} connected`);
    } // PIP#connectSP

    connectRP(RP) {
        if (!(RP instanceof RP))
            this.throw('connectRP', new TypeError(`invalid param`));

        this.data.RPs.set(Symbol(), RP);

        this.log('connectRP', `${RP.toString(undefined, true)} connected`);
    } // PIP#connectRP

} // PIP

//#endregion PIP

module.exports = PIP;