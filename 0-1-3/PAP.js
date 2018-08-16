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
        queryBlocks.push(`MERGE (${name}:ODRL:${odrl['@type']})`);
    }

    switch (odrl['@type']) {

        case 'Action':

            if (odrl['id'] !== 'use' && odrl['id'] !== 'transfer') {
                if (typeof odrl['includedIn'] === 'string') {
                    const includedIn_name = name + "_includedIn";
                    queryBlocks.push(`MERGE (${includedIn_name}:ODRL:Action {id: "${odrl['includedIn']}"})`);
                    queryBlocks.push(`ON CREATE SET ${includedIn_name}.blank = true`);
                    queryBlocks.push(`MERGE (${name})-[:includedIn]->(${includedIn_name})`);
                } else {
                    throw `Action '${odrl['id']}' must have an includedIn`;
                }
            } // ODRL~Action.includedIn

            if (odrl['implies']) {
                Utility.toArray(odrl['implies']).forEach((implies_elem, index) => {
                    const implies_name = name + "_implies" + index;
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
                // TODO
            }// ODRL~AssetCollection.refinement

        // NOTE ODRL~AssetCollection -> no break

        case 'Asset':

            if (odrl['partOf']) {
                Utility.toArray(odrl['partOf']).forEach((partOf_elem, index) => {
                    const partOf_name = name + "_partOf" + index;
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
                // TODO 
            } // ODRL~PartyCollection.refinement

        // NOTE ODRL~PartyCollection -> no break

        case 'Party':

            if (odrl['partOf']) {
                Utility.toArray(odrl['partOf']).forEach((partOf_elem, index) => {
                    const partOf_name = name + "_partOf" + index;
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
                // TODO
            } // ODRL~Policy.inheritFrom

            if (odrl['conflict']) {
                // TODO
            } // ODRL~Policy.conflict

            if (odrl['permission']) {
                // TODO
            } // ODRL~Policy.permission

            if (odrl['obligation']) {
                // TODO 
            } // ODRL~Policy.obligation

            if (odrl['prohibition']) {
                // TODO
            } // ODRL~Policy.prohibition

            break; // ODRL~Policy

        case 'Permission':

            if (odrl['duty']) {
                // TODO
            } // ODRL~Policy.prohibition

        // NOTE ODRL~Permission -> no break

        case 'Duty':

            if (odrl['consequence'] && odrl['@type'] === 'Duty') {
                // TODO 
            } // ODRL~Duty.consequence

        // NOTE ODRL~Duty -> no break

        case 'Prohibition':

            if (odrl['remedy'] && odrl['@type'] === 'Prohibition') {
                // TODO
            } // ODRL~Prohibition.remedy

        // NOTE ODRL~Prohibition -> no break

        case 'Rule':

            if (odrl['failure']) {
                // TODO
            } // ODRL~Rule.failure

            if (odrl['action']) {
                // TODO
            } // ODRL~Rule.action

            if (odrl['target']) {
                // TODO
            } // ODRL~Rule.target

            if (odrl['assignee']) {
                // TODO
            } // ODRL~Rule.assignee

            if (odrl['assigner']) {
                // TODO
            } // ODRL~Rule.assigner

            if (odrl['constraint']) {
                // TODO
            } // ODRL~Rule.constraint

            break; // ODRL~Rule

        case 'Constraint':

            if (odrl['operator']) {
                // TODO
            } // ODRL~Constraint.operator

            if (odrl['leftOperand']) {
                // TODO
            } // ODRL~Constraint.leftOperand

            if (odrl['rightOperand']) {
                // TODO
            } // ODRL~Constraint.rightOperand

            break; // ODRL~Constraint

        case 'LogicalConstraint':

            if (odrl['operand']) {
                // TODO
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
                cypherQueries = odrlJSON['@graph'].map((elem, index) => generateLoadQuery(elem, 'n' + index));
            } catch (errMsg) {
                throw new Error(this.toString('loadODRL', 'odrlJSON', errMsg));
            }

            console.log(cypherQueries);

            // TODO PAP#loadODRL -> weitermachen
        }
    } // PAP#loadODRL

} // PAP

Utility.getPublicClass(PAP);
module.exports = PAP;