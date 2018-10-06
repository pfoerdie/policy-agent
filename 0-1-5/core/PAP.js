/**
 * Policy Administration Point
 * @module PolicyAgent.PAP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    Neo4j = require('neo4j-driver').v1,
    PolicyPoint = require('./PolicyPoint.js');

/**
 * @name _requestNeo4j
 * @param {string} query 
 * @returns {*}
 * @this {PAP}
 * @private
 * @async
 */
async function _requestNeo4j(query) {
    let
        queryArr = Array.isArray(query) ? query : null,
        session = this.data.driver.session(),
        result = queryArr
            ? await Promise.all(queryArr.map(query => session.run(query)))
            : await session.run(query);

    session.close();
    return result;
} // _requestNeo4j

/**
 * @name _makeSubmitQuery
 * @param {string} varName 
 * @param {JSON} odrl 
 * @return {string}
 * @this {PAP}
 * @private
 *
 * INFO {@link https://www.w3.org/TR/odrl-model/#infoModel ODRL Information Model}
 * INFO always use MERGE queries, never MATCH
 */
function _makeSubmitQuery(varName, odrl) {
    if (
        typeof varName !== 'string' || varName.length === 0 ||
        typeof odrl !== 'object' || typeof odrl['@type'] !== 'string'
    )
        this.throw('_makeSubmitQuery', new TypeError(`invalid argument`));

    const queryBlocks = [];

    if (odrl['@type'] === 'Action') {
        queryBlocks.push(`MERGE (${varName}:ODRL:Action {id: "${odrl['id']}"})`);
    } else {
        if (typeof odrl['uid'] !== 'string')
            odrl['uid'] = UUID(); // NOTE vllt müsste man nochmal überprüfen, ob die uid auch wirklich nicht vorkommt

        queryBlocks.push(`MERGE (${varName}:ODRL:${odrl['@type']} {uid: "${odrl['uid']}"})`);
    }

    switch (odrl['@type']) {

        case 'Action':

            if (odrl['id'] !== 'use' && odrl['id'] !== 'transfer') {
                if (typeof odrl['includedIn'] === 'string') {
                    throw `not implementet jet`; // TODO implement
                } else {
                    this.throw('_makeSubmitQuery', new Error(`missing includedIn (${odrl['id']})`));
                }
            } // ODRL~Action.includedIn

            if (odrl['implies']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Action.implies

            // NOTE ODRL~Action.refinement is only defined in requests to submit arguments

            break; // ODRL~Action

        case 'AssetCollection':

            if (odrl['refinement']) {
                throw `not implementet jet`; // TODO implement
            }// ODRL~AssetCollection.refinement

            // NOTE ODRL~AssetCollection -> no break

            queryBlocks.push(`SET ${name} :Asset`);

        case 'Asset':

            if (odrl['partOf']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Asset.partOf

            // NOTE ODRL~Asset.hasPolicy is only defined in requests

            break; // ODRL~Asset

        case 'PartyCollection':

            if (odrl['refinement']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~PartyCollection.refinement

            // NOTE ODRL~PartyCollection -> no break

            queryBlocks.push(`SET ${name} :Party`);

        case 'Party':

            if (odrl['partOf']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Party.partOf

            break; // ODRL~Party

        case 'Policy':

            if (odrl['inheritFrom']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Policy.inheritFrom

            if (odrl['conflict']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Policy.conflict

            if (odrl['permission']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Policy.permission

            if (odrl['obligation']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Policy.obligation

            if (odrl['prohibition']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Policy.prohibition

            break; // ODRL~Policy

        case 'Permission':

            if (odrl['duty'] && odrl['@type'] === 'Permission') {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Policy.prohibition

        // NOTE ODRL~Permission -> no break

        case 'Duty':

            if (odrl['consequence'] && odrl['@type'] === 'Duty') {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Duty.consequence

        // NOTE ODRL~Duty -> no break

        case 'Prohibition':

            if (odrl['remedy'] && odrl['@type'] === 'Prohibition') {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Prohibition.remedy

            // NOTE ODRL~Prohibition -> no break

            queryBlocks.push(`SET ${name} :Rule`);

        case 'Rule':

            if (odrl['failure']) {
                // TODO failure ist evtl nicht richtig, dies muss eine sub-property von failure sein
                throw `not implementet jet`; // TODO implement
            } // ODRL~Rule.failure

            if (odrl['action']) {
                throw `not implementet jet`; // TODO implement
            } else {
                this.throw('_makeSubmitQuery', new Error(`missing action (${odrl['uid']})`));
            } // ODRL~Rule.action

            if (odrl['target']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Rule.target

            if (odrl['assignee']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Rule.assignee

            if (odrl['assigner']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Rule.assigner

            if (odrl['constraint']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Rule.constraint

            break; // ODRL~Rule

        case 'Constraint':

            if (odrl['operator']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Constraint.operator

            if (odrl['leftOperand']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Constraint.leftOperand

            if (odrl['rightOperand']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~Constraint.rightOperand

            break; // ODRL~Constraint

        case 'LogicalConstraint':

            if (odrl['operand']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~LogicalConstraint.operand

            break; // ODRL~LogicalConstraint

        case 'ConflictTerm':
        case 'Operator':
        case 'LeftOperand':
        case 'RightOperand':

            // NOTE ODRL ~ConflictTerm, ~Operator, ~LeftOperand and ~RightOperand have no properties

            break;

        default:
            this.throw('_makeSubmitQuery', new TypeError(`invalid @type (${odrl['@type']})`));

    } // switch

    queryBlocks.push(`SET ${varName}.blank = null`);
    return queryBlocks.join("\n");
} // _makeSubmitQuery

/**
 * @name PAP
 * @extends PolicyPoint
 */
class PAP extends PolicyPoint {
    /**
     * @constructs PAP
     * @param {JSON} [options={}]
     * @param {string} [options.host="localhost"]
     * @param {number} [options.port=7687]
     * @param {string} [options.user="neo4j"]
     * @param {string} [options.password="neo4j"]
     */
    constructor(options = {}) {
        super(options);

        if (!options || typeof options !== 'object')
            this.throw('constructor', new TypeError(`invalid argument`));

        const connection = {
            host: (options['host'] || "localhost") + ":" + (options['port'] || 7687),
            user: options['user'] || "neo4j",
            password: options['password'] || "neo4j"
        };

        this.data.driver = Neo4j.driver(
            `bolt://${connection.host}`,
            Neo4j.auth.basic(connection.user, connection.password)
        );
    } // PAP.constructor

    /**
     * @name PAP#ping
     * @async
     */
    async ping() {
        try {
            const result = await _requestNeo4j.call(this, `RETURN NULL`);
            session.close();
            this.log('ping', "success");
            return result['summary']['server'];
        } catch (err) {
            this.throw('ping', err);
        }
    } // PAP#ping

    /**
     * @name PAP#_retrievePolicies
     * @param {(string|string[])} query Query in the cypher query language.
     * @returns {*} Result of the request to Neo4j. // TODO returns {ODRL}
     * @async
     * @package
     */
    async _retrievePolicies(query) {
        const queryArr = Array.isArray(query) ? query : null;

        if (queryArr ? queryArr.some(query => typeof query !== 'string') : typeof query !== 'string')
            this.throw('_retrievePolicies', new TypeError(`invalid argument`));

        try {
            let
                result = await _requestNeo4j.call(this, query),
                resultArr = queryArr ? result : null;

            // IDEA result bereinigen und als Policies-Array zurückgeben

            return result;
        } catch (err) {
            this.throw('_retrievePolicies', err);
        }
    } // PAP#_retrievePolicies

    /**
     * @name PAP#_submitODRL
     * @param {JSON} odrl 
     * @returns {*} TODO
     * @async
     * @package
     */
    async _submitODRL(odrl) {

        // TODO

    } // PAP#_submitODRL

} // PAP

module.exports = PAP;