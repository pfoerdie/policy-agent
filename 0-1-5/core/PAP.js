/**
 * Policy Administration Point
 * @module PolicyAgent.PAP
 * @author Simon Petrac
 */

const
    UUID = require('uuid/v4'),
    Neo4j = require('neo4j-driver').v1,
    PolicyPoint = require('./PolicyPoint.js'),
    _toArray = (val) => Array.isArray(val) ? val : val !== undefined ? [val] : [];

/**
* @name Entry
* @class
*/
class Entry {
    constructor(record = {}) {
        record['keys'].forEach(key => Object.defineProperty(this, key, {
            enumerable: true,
            value: record['_fields'][record['_fieldLookup'][key]]
        }));
    } // Entry.constructor

} // Entry

/**
 * @name _prettifyRecord
 * @param {Neo4j~Record} record 
 * @returns {object}
 */
function _prettifyRecord(record) {
    let pretty = {};
    record['keys'].forEach(key => Object.defineProperty(pretty, key, {
        enumerable: true,
        value: record['_fields'][record['_fieldLookup'][key]]
    }));
    return pretty;
} // _prettifyRecord

/**
 * @function _makeSubmitQuery
 * @param {string} varName 
 * @param {JSON} odrl 
 * @return {string}
 * @private
 *
 * INFO {@link https://www.w3.org/TR/odrl-model/#infoModel ODRL Information Model}
 * INFO This function uses recursion to deal with nested nodes.
 * 
 * TODO expanding shortcut properties wie in ODRL angegeben
 */
function _makeSubmitQuery(varName, odrl) {
    // NOTE always use MERGE queries, never MATCH

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
            odrl['uid'] = UUID();

        queryBlocks.push(`MERGE (${varName}:ODRL:${odrl['@type']} {uid: "${odrl['uid']}"})`);
    }

    switch (odrl['@type']) {

        case 'Action':

            if (odrl['id'] !== 'use' && odrl['id'] !== 'transfer') {
                if (typeof odrl['includedIn'] === 'string') {
                    const includedIn_name = varName + "incl";
                    queryBlocks.push(`MERGE (${includedIn_name}:ODRL:Action {id: "${odrl['includedIn']}"})`);
                    queryBlocks.push(`ON CREATE SET ${includedIn_name}.blank = true`);
                    queryBlocks.push(`MERGE (${varName})-[:includedIn]->(${includedIn_name})`);
                } else {
                    this.throw('_makeSubmitQuery', new Error(`missing includedIn (${odrl['id']})`));
                }
            } // ODRL~Action.includedIn

            if (odrl['implies']) {
                _toArray(odrl['implies']).forEach((implies_elem, index) => {
                    const implies_name = varName + "impl" + index;
                    if (typeof implies_elem === 'string') {
                        queryBlocks.push(`MERGE (${implies_name}:ODRL:Action {id: "${implies_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${implies_name}.blank = true`);
                    } else {
                        queryBlocks.push(_makeSubmitQuery(implies_name, implies_elem));
                    }
                    queryBlocks.push(`MERGE (${varName})-[:implies]->(${implies_name})`);
                });
            } // ODRL~Action.implies

            // NOTE ODRL~Action.refinement is only defined in requests to submit arguments

            break; // ODRL~Action

        case 'AssetCollection':

            if (odrl['refinement']) {
                throw `not implementet jet`; // TODO implement
            }// ODRL~AssetCollection.refinement

            // NOTE ODRL~AssetCollection -> no break

            queryBlocks.push(`SET ${varName} :Asset`);

        case 'Asset':

            if (odrl['partOf']) {
                _toArray(odrl['partOf']).forEach((partOf_elem, index) => {
                    const partOf_name = varName + "part" + index;
                    if (typeof partOf_elem === 'string') {
                        queryBlocks.push(`MERGE (${partOf_name}:ODRL:AssetCollection {uid: "${partOf_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${partOf_name}.blank = true`);
                    } else {
                        queryBlocks.push(_makeSubmitQuery(partOf_name, partOf_elem));
                    }
                    queryBlocks.push(`MERGE (${varName})-[:partOf]->(${partOf_name})`);
                });
            } // ODRL~Asset.partOf

            // NOTE ODRL~Asset.hasPolicy is only defined in requests

            break; // ODRL~Asset

        case 'PartyCollection':

            if (odrl['refinement']) {
                throw `not implementet jet`; // TODO implement
            } // ODRL~PartyCollection.refinement

            // NOTE ODRL~PartyCollection -> no break

            queryBlocks.push(`SET ${varName} :Party`);

        case 'Party':

            if (odrl['partOf']) {
                _toArray(odrl['partOf']).forEach((partOf_elem, index) => {
                    const partOf_name = varName + "part" + index;
                    if (typeof partOf_elem === 'string') {
                        queryBlocks.push(`MERGE (${partOf_name}:ODRL:PartyCollection {uid: "${partOf_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${partOf_name}.blank = true`);
                    } else {
                        queryBlocks.push(_makeSubmitQuery(partOf_name, partOf_elem));
                    }
                    queryBlocks.push(`MERGE (${varName})-[:partOf]->(${partOf_name})`);
                });
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
                _toArray(odrl['permission']).forEach((permission_elem, index) => {
                    const permission_name = varName + "perm" + index;
                    if (typeof permission_elem === 'string') {
                        queryBlocks.push(`MERGE (${permission_name}:ODRL:Rule {uid: "${permission_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${permission_name}.blank = true`);
                    } else {
                        queryBlocks.push(_makeSubmitQuery(permission_name, permission_elem));
                    }
                    queryBlocks.push(`MERGE (${varName})-[:permission]->(${permission_name})`);
                });
            } // ODRL~Policy.permission

            if (odrl['obligation']) {
                _toArray(odrl['obligation']).forEach((obligation_elem, index) => {
                    const obligation_name = varName + "obli" + index;
                    if (typeof obligation_elem === 'string') {
                        queryBlocks.push(`MERGE (${obligation_name}:ODRL:Rule {uid: "${obligation_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${obligation_name}.blank = true`);
                    } else {
                        queryBlocks.push(_makeSubmitQuery(obligation_name, obligation_elem));
                    }
                    queryBlocks.push(`MERGE (${varName})-[:obligation]->(${obligation_name})`);
                });
            } // ODRL~Policy.obligation

            if (odrl['prohibition']) {
                _toArray(odrl['prohibition']).forEach((prohibition_elem, index) => {
                    const prohibition_name = varName + "proh" + index;
                    if (typeof prohibition_elem === 'string') {
                        queryBlocks.push(`MERGE (${prohibition_name}:ODRL:Rule {uid: "${prohibition_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${prohibition_name}.blank = true`);
                    } else {
                        queryBlocks.push(_makeSubmitQuery(prohibition_name, prohibition_elem));
                    }
                    queryBlocks.push(`MERGE (${varName})-[:prohibition]->(${prohibition_name})`);
                });
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

            queryBlocks.push(`SET ${varName} :Rule`);

        case 'Rule':

            if (odrl['failure']) {
                // TODO failure ist evtl nicht richtig, dies muss eine sub-property von failure sein
                throw `not implementet jet`; // TODO implement
            } // ODRL~Rule.failure

            if (odrl['action']) {
                const action_name = varName + "acti";
                if (typeof odrl['action'] === 'string') {
                    queryBlocks.push(`MERGE (${action_name}:ODRL:Action {id: "${odrl['action']}"})`);
                    queryBlocks.push(`ON CREATE SET ${action_name}.blank = true`);
                    queryBlocks.push(`MERGE (${varName})-[:action]->(${action_name})`);
                } else {
                    throw `not implemented jet`; // TODO implement action with refinement
                }
            } else {
                this.throw('_makeSubmitQuery', new Error(`missing action (${odrl['uid']})`));
            } // ODRL~Rule.action

            if (odrl['target']) {
                const target_name = varName + "targ";
                if (typeof odrl['target'] === 'string') {
                    queryBlocks.push(`MERGE (${target_name}:ODRL:Asset {uid: "${odrl['target']}"})`);
                    queryBlocks.push(`ON CREATE SET ${target_name}.blank = true`);
                } else {
                    queryBlocks.push(_makeSubmitQuery(target_name, odrl['target']));
                }
                queryBlocks.push(`MERGE (${varName})-[:target]->(${target_name})`);
            } // ODRL~Rule.target

            if (odrl['assignee']) {
                _toArray(odrl['assignee']).forEach((assignee_elem, index) => {
                    const assignee_name = varName + "anee" + index;
                    if (typeof assignee_elem === 'string') {
                        queryBlocks.push(`MERGE (${assignee_name}:ODRL:Party {uid: "${assignee_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${assignee_name}.blank = true`);
                    } else {
                        queryBlocks.push(_makeSubmitQuery(assignee_name, assignee_elem));
                    }
                    queryBlocks.push(`MERGE (${varName})-[:assignee]->(${assignee_name})`);
                });
            } // ODRL~Rule.assignee

            if (odrl['assigner']) {
                _toArray(odrl['assigner']).forEach((assigner_elem, index) => {
                    const assigner_name = varName + "aner" + index;
                    if (typeof assigner_elem === 'string') {
                        queryBlocks.push(`MERGE (${assigner_name}:ODRL:Party {uid: "${assigner_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${assigner_name}.blank = true`);
                    } else {
                        queryBlocks.push(_makeSubmitQuery(assigner_name, assigner_elem));
                    }
                    queryBlocks.push(`MERGE (${varName})-[:assigner]->(${assigner_name})`);
                });
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
 * @extends PolicyAgent.PolicyPoint
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
            let
                session = this.data.driver.session(),
                result = await session.run("RETURN NULL");

            session.close();
            this.log('ping', "success");
            return result['summary']['server'];
        } catch (err) {
            this.throw('ping', err);
        }
    } // PAP#ping

    /**
     * @name PAP#_request
     * @param {(string|string[])} query Query in the cypher query language.
     * @returns {(object|object[])} Prettified records of the Neo4j result.
     * @package
     * @async
     */
    async _request(query, param) {
        const queryArr = Array.isArray(query) ? query : null;

        if (queryArr ? queryArr.some(query => typeof query !== 'string') : typeof query !== 'string')
            this.throw('_request', new TypeError(`invalid argument`));
        if (param && typeof param !== 'object')
            this.throw('_request', new TypeError(`invalid argument`));

        try {
            let
                session = this.data.driver.session(),
                result = queryArr
                    ? await Promise.all(queryArr.map(query => session.run(query, param)))
                    : await session.run(query, param),
                resultArr = queryArr ? result : null;

            // IDEA Neo4j~Tx (transactions) benutzen, um bei Fehlern im Nachhinein Änderungen rückgängig zu machen

            session.close();
            return resultArr
                ? resultArr.map(result => result['records'].map(_prettifyRecord))
                : result['records'].map(_prettifyRecord);

        } catch (err) {
            this.throw('_request', err);
        }
    } // PAP#_request

    /**
     * @name PAP#_submitODRL
     * @param {JSON} odrl This object will get generated uids for every missing uid. May be useful to save for later.
     * @async
     * @package
     * 
     * INFO Circular includedIn or implies in the actions must not occur.
     */
    async _submitODRL(odrl) {
        if (typeof odrl !== 'object' || odrl['@context'] !== "http://www.w3.org/ns/odrl/2/" || !Array.isArray(odrl['@graph']))
            this.throw('_submitODRL', new TypeError(`invalid argument`));

        // let cypherQueries = odrl['@graph'].map((elem, index) => _makeSubmitQuery("n" + index, elem));
        let cypherQueries = odrl['@graph'].map((elem, index) => _makeSubmitQuery("n" + index, elem));

        console.log(cypherQueries.join("\n;\n\n"));
        // TODO überprüfen und code freischalten

        await this._request(cypherQueries);
        await this._request(`MATCH (n:ODRL {blank: true}) DETACH DELETE n`);

        this.log('_submitODRL', "completed");

    } // PAP#_submitODRL

} // PAP

module.exports = PAP;