/**
 * Policy Decision Point
 * @module PolicyAgent.PDP
 * @author Simon Petrac
 */

const
    PolicyPoint = require('./PolicyPoint.js'),
    Context = require('./Context.js'),
    PIP = require('./PIP.js'),
    PAP = require('./PAP.js');

/**
 * @name PDP
 * @extends PolicyAgent.PolicyPoint
 */
class PDP extends PolicyPoint {
    /**
     * @constructs PDP
     * @param {JSON} [options={}]
     * @abstract
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.administrationPoint = null;
        this.data.informationPoint = null;

    } // PDP.constructor

    /**
     * Adds a PIP to retrieve information.
     * @name PDP#connectPIP
     * @param {PolicyAgent.PIP} informationPoint 
     */
    connectPIP(informationPoint) {
        if (!(informationPoint instanceof PIP))
            this.throw('connectPIP', new TypeError(`invalid argument`));
        if (this.data.informationPoint)
            this.throw('connectPIP', `AttributeStore already connected`);

        this.data.informationPoint = informationPoint;
        this.log('connectPIP', `${informationPoint.toString(undefined, true)} connected`);
    } // PDP#connectPIP

    /**
     * Adds a PAP to retrieve policies.
     * @name PDP#connectPAP
     * @param {PolicyAgent.PAP} administrationPoint 
     */
    connectPAP(administrationPoint) {
        if (!(administrationPoint instanceof PAP))
            this.throw('connectPAP', new TypeError(`invalid argument`));
        if (this.data.administrationPoint)
            this.throw('connectPAP', `PAP already connected`);

        this.data.administrationPoint = administrationPoint;
        this.log('connectPAP', `${administrationPoint.toString(undefined, true)} connected`);
    } // PDP#connectPAP

    /**
     * @name PDP#_requestDecision
     * @param {Context} context
     * @async
     * 
     * INFO 7.17 Authorization decision:
     *   -> The PDP MUST return a response context, with one <Decision> element of value "Permit", "Deny", "Indeterminate" or "NotApplicable".
     */
    async _requestDecision(requestContext) {
        if (!PolicyPoint.validate('PolicyAgent~RequestContext', requestContext))
            this.throw('_requestDecision', new TypeError(`invalid argument`));

        if (!this.data.informationPoint)
            this.throw('_requestDecision', new Error(`informationPoint not connected`));
        if (!this.data.administrationPoint)
            this.throw('_requestDecision', new Error(`administrationPoint not connected`));

        let
            requestMap = new Map(requestContext['@graph'].map(elem => [elem['@id'], elem])),
            responseMap = new Map(),
            requestSubjects = [],
            indexMatching = [];

        requestMap.forEach((entry, id) => {
            if (entry['@type'] === 'Request') {
                const response = {
                    '@type': "Response",
                    '@id': id,
                    'action': entry['action']
                };

                for (let name of ['target', 'assigner', 'assignee']) {
                    let subject = typeof entry[name] === 'string'
                        ? requestMap[entry[name]]
                        : entry[name];

                    if (subject && subject['@type'] !== "Request" && subject['@type'] !== "Response") {
                        let tmpIndex = requestSubjects.findIndex(elem => elem === subject || (elem['@id'] && elem['@id'] === subject['@id']));

                        if (tmpIndex < 0) {
                            requestSubjects.push(subject);
                            indexMatching.push([[id, name]]);
                        } else {
                            indexMatching[tmpIndex].push([id, name]);
                        }
                    }
                } // for

                responseMap.set(id, response);
            }
        });

        let responseSubjects = await this.data.informationPoint._retrieveSubjects(requestSubjects);

        indexMatching.forEach((matching, index) => {
            let subject = responseSubjects[index];

            if (!subject || !subject['uid']) return;

            if (!responseMap.has(subject['uid'])) {
                responseMap.set(subject['uid'], {
                    '@type': match[1] === 'target' ? 'Asset' : 'Party',
                    '@id': subject['uid'],
                    'subject': subject,
                    '@source': this.data.informationPoint.id
                });
            }

            matching.forEach(([id, name]) => {
                responseMap.get(id)[name] = subject['uid'];
            });
        });

        // TODO

        return {
            '@context': "PolicyAgent~ResponseContext",
            '@graph': responseMap.entries().map(entry => entry[1])
        };

    } // PDP#_requestDecision

    /**
     * TODO
     */
    async _finalizeRequest(responseContext) {
        // TODO
    } // PDP#_finalizeRequest

} // PDP

module.exports = PDP;