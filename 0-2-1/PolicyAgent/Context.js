const
    Assert = require('assert'),
    PRP = require("./PRP.js"),
    PIP = require("./PIP.js"),
    PAP = require("./PAP.js"),
    PDP = require("./PDP.js"),
    PXP = require("./PXP.js"),
    PEP = require("./PEP.js");

class Context {

    constructor() {
        this.phase = 'idle';
        this.id = T.uuid();
        this.tss = T.hrt();
        this.requests = new Map();
        this.cache = new Map();
        // TODO
    } // Context#constructor

    async exec(request) {
        Assert.equal(this.phase, 'idle', "already executed");
        try {

            this.phase = 'make_requests';
            await PEP._makeRequests(this, request);

            this.phase = 'expand_actions';
            await PXP._expandActions(this);

            // PIP._retrieveEntities
            // PAP._retrievePolicies
            // PDP._makeDecision
            // PXP._executeActions

            this.phase = 'finished';
            this.tse = T.hrt();

        } catch (err) {
            this.phase = 'failed';
            this.tse = T.hrt();
            throw err;
        }
    } // Context#exec

} // Context

module.exports = Context;