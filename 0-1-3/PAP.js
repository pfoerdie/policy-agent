/**
 * @module PolicyAgent~PAP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    PolicyPoint = require(Path.join(__dirname, "PolicyPoint.js")),
    DataStore = require(Path.join(__dirname, "DataStore.js"));

function generateLoadQuery(odrl, name) {
    /** {@link https://www.w3.org/TR/odrl-model/#infoModel ODRL Information Model} */

    if (typeof odrl !== 'object' || typeof odrl['@type'] !== 'string')
        throw `invalid odrl`;

    let queryBlocks = [];

    //  NOTE always use MERGE queries, never MATCH

    if (odrl['@type'] === 'Action') {
        if (typeof odrl['id'] !== 'string')
            throw `Action must have an id`;

        queryBlocks.push(`MERGE (${name}:ODRL:Action {id: "${odrl['id']}"})`);
    } else if (typeof odrl['uid'] === 'string') {
        queryBlocks.push(`MERGE (${name}:ODRL:${odrl['@type']} {uid: "${odrl['uid']}"})`);
    } else {
        queryBlocks.push(`CREATE (${name}:ODRL:${odrl['@type']})`);
    }

    switch (odrl['@type']) {

        case 'Action':

            if (odrl['id'] !== 'use' && odrl['id'] !== 'transfer') {
                if (typeof odrl['includedIn'] === 'string') {
                    const includedIn_name = name + "incl";
                    queryBlocks.push(`MERGE (${includedIn_name}:ODRL:Action {id: "${odrl['includedIn']}"})`);
                    queryBlocks.push(`ON CREATE SET ${includedIn_name}.blank = true`);
                    queryBlocks.push(`MERGE (${name})-[:includedIn]->(${includedIn_name})`);
                } else {
                    throw `Action '${odrl['id']}' must have an includedIn`;
                }
            } // ODRL~Action.includedIn

            if (odrl['implies']) {
                Utility.toArray(odrl['implies']).forEach((implies_elem, index) => {
                    const implies_name = name + "impl" + index;
                    if (typeof implies_elem === 'string') {
                        queryBlocks.push(`MERGE (${implies_name}:ODRL:Action {id: "${implies_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${implies_name}.blank = true`);
                    } else {
                        queryBlocks.push(generateLoadQuery(implies_elem), implies_name);
                    }
                    queryBlocks.push(`MERGE (${name})-[:implies]->(${implies_name})`);
                });
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
                Utility.toArray(odrl['partOf']).forEach((partOf_elem, index) => {
                    const partOf_name = name + "part" + index;
                    if (typeof partOf_elem === 'string') {
                        queryBlocks.push(`MERGE (${partOf_name}:ODRL:AssetCollection {uid: "${partOf_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${partOf_name}.blank = true`);
                    } else {
                        queryBlocks.push(generateLoadQuery(partOf_elem), partOf_name);
                    }
                    queryBlocks.push(`MERGE (${name})-[:partOf]->(${partOf_name})`);
                });
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
                Utility.toArray(odrl['partOf']).forEach((partOf_elem, index) => {
                    const partOf_name = name + "part" + index;
                    if (typeof partOf_elem === 'string') {
                        queryBlocks.push(`MERGE (${partOf_name}:ODRL:PartyCollection {uid: "${partOf_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${partOf_name}.blank = true`);
                    } else {
                        queryBlocks.push(generateLoadQuery(partOf_elem), partOf_name);
                    }
                    queryBlocks.push(`MERGE (${name})-[:partOf]->(${partOf_name})`);
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
                Utility.toArray(odrl['permission']).forEach((permission_elem, index) => {
                    const permission_name = name + "perm" + index;
                    if (typeof permission_elem === 'string') {
                        queryBlocks.push(`MERGE (${permission_name}:ODRL:Rule {uid: "${permission_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${permission_name}.blank = true`);
                    } else {
                        queryBlocks.push(generateLoadQuery(permission_elem, permission_name));
                    }
                    queryBlocks.push(`MERGE (${name})-[:permission]->(${permission_name})`);
                });
            } // ODRL~Policy.permission

            if (odrl['obligation']) {
                Utility.toArray(odrl['obligation']).forEach((obligation_elem, index) => {
                    const obligation_name = name + "obli" + index;
                    if (typeof obligation_elem === 'string') {
                        queryBlocks.push(`MERGE (${obligation_name}:ODRL:Rule {uid: "${obligation_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${obligation_name}.blank = true`);
                    } else {
                        queryBlocks.push(generateLoadQuery(obligation_elem, obligation_name));
                    }
                    queryBlocks.push(`MERGE (${name})-[:obligation]->(${obligation_name})`);
                });
            } // ODRL~Policy.obligation

            if (odrl['prohibition']) {
                Utility.toArray(odrl['prohibition']).forEach((prohibition_elem, index) => {
                    const prohibition_name = name + "proh" + index;
                    if (typeof prohibition_elem === 'string') {
                        queryBlocks.push(`MERGE (${prohibition_name}:ODRL:Rule {uid: "${prohibition_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${prohibition_name}.blank = true`);
                    } else {
                        queryBlocks.push(generateLoadQuery(prohibition_elem, prohibition_name));
                    }
                    queryBlocks.push(`MERGE (${name})-[:prohibition]->(${prohibition_name})`);
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

            queryBlocks.push(`SET ${name} :Rule`);

        case 'Rule':

            if (odrl['failure']) {
                // TODO failure ist evtl nicht richtig, dies muss eine sub-property von failure sein
                throw `not implementet jet`; // TODO implement
            } // ODRL~Rule.failure

            if (odrl['action']) {
                const action_name = name + "acti";
                if (typeof odrl['action'] === 'string') {
                    queryBlocks.push(`MERGE (${action_name}:ODRL:Action {id: "${odrl['action']}"})`);
                    queryBlocks.push(`ON CREATE SET ${action_name}.blank = true`);
                    queryBlocks.push(`MERGE (${name})-[:action]->(${action_name})`);
                } else {
                    throw `not implemented jet`; // TODO implement action with refinement
                }
            } else {
                throw `Rule '${odrl['uid']}' must have an action`;
            } // ODRL~Rule.action

            if (odrl['target']) {
                const target_name = name + "targ";
                if (typeof odrl['target'] === 'string') {
                    queryBlocks.push(`MERGE (${target_name}:ODRL:Asset {uid: "${odrl['target']}"})`);
                    queryBlocks.push(`ON CREATE SET ${target_name}.blank = true`);
                } else {
                    queryBlocks.push(generateLoadQuery(odrl['target'], target_name));
                }
                queryBlocks.push(`MERGE (${name})-[:target]->(${target_name})`);
            } // ODRL~Rule.target

            if (odrl['assignee']) {
                Utility.toArray(odrl['assignee']).forEach((assignee_elem, index) => {
                    const assignee_name = name + "anee" + index;
                    if (typeof assignee_elem === 'string') {
                        queryBlocks.push(`MERGE (${assignee_name}:ODRL:Party {uid: "${assignee_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${assignee_name}.blank = true`);
                    } else {
                        queryBlocks.push(generateLoadQuery(assignee_elem, assignee_name));
                    }
                    queryBlocks.push(`MERGE (${name})-[:assignee]->(${assignee_name})`);
                });
            } // ODRL~Rule.assignee

            if (odrl['assigner']) {
                Utility.toArray(odrl['assigner']).forEach((assigner_elem, index) => {
                    const assigner_name = name + "aner" + index;
                    if (typeof assigner_elem === 'string') {
                        queryBlocks.push(`MERGE (${assigner_name}:ODRL:Party {uid: "${assigner_elem}"})`);
                        queryBlocks.push(`ON CREATE SET ${assigner_name}.blank = true`);
                    } else {
                        queryBlocks.push(generateLoadQuery(assigner_elem, assigner_name));
                    }
                    queryBlocks.push(`MERGE (${name})-[:assigner]->(${assigner_name})`);
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

            throw `invalid type '${odrl['@type']}'`;

    } // switch

    queryBlocks.push(`SET ${name}.blank = null`);
    return queryBlocks.join(" \n");

} // PAP~generateLoadQuery

/**
 * Policy Administration Point
 * @name PAP
 */
class PAP extends PolicyPoint {
    /**
     * @constructs PAP
     * @param {Neo4jStore} policyStore 
     */
    constructor(policyStore) {
        super('PAP');

        Object.defineProperties(this.param, {
            policyStore: {
                value: Utility.validParam(param => param instanceof DataStore.Neo4j, policyStore)
            }
        });
    } // PAP#constructor

    async loadODRL(odrlJSON = {}) {
        if (odrlJSON['@graph']) {
            if (odrlJSON['@context'] !== "http://www.w3.org/ns/odrl/2/")
                throw new Error(this.toString('loadODRL', 'odrlJSON', `odrlJSON.@context has to be "http://www.w3.org/ns/odrl/2/"`));
            if (!Array.isArray(odrlJSON['@graph']))
                throw new Error(this.toString('loadODRL', 'odrlJSON', `odrlJSON.@graph has to be an array`));

            let cypherQueries;

            try {
                cypherQueries = odrlJSON['@graph'].map((elem, index) => generateLoadQuery(elem, "n" + index));
            } catch (errMsg) {
                throw new Error(this.toString('loadODRL', 'odrlJSON', errMsg));
            }

            await this.param.policyStore._execute(cypherQueries.join(" \n"));
            await this.param.policyStore._execute(`MATCH (n:ODRL {blank: true}) DETACH DELETE n`);
        }
    } // PAP#loadODRL

} // PAP

Utility.getPublicClass(PAP);
module.exports = PAP;