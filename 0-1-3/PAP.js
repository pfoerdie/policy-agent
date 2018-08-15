/**
 * @module PolicyAgent~PAP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    PolicyPoint = require(Path.join(__dirname, "PolicyPoint.js")),
    DataStore = require(Path.join(__dirname, "DataStore.js"));

function constructLoadQuery(odrl) {
    if (typeof odrl !== 'object' || typeof odrl['@type'] !== 'string')
        throw `invalid odrl`;

    let queryBlocks = [];

    if (odrl['@type'] === 'Action') {
        queryBlocks.push(`MERGE (n:ODRL:Action {id: "${odrl['id']}"})`);
    } else {
        queryBlocks.push(`MERGE (n:ODRL:${odrl['@type']} {uid: "${odrl['uid']}"})`);
    }

    switch (odrl['@type']) {

        case 'Action':
            if (odrl['includedIn']) {
                // TODO PAP#loadODRL -> Action#includedIn
            }
            if (odrl['implies']) {
                // TODO PAP#loadODRL -> Action#implies
            }
            break; // Action

        case 'AssetCollection':
            if (odrl['refinement']) {
                // TODO PAP#loadODRL -> AssetCollection#refinement
            }
        case 'Asset':
            // NOTE PAP#loadODRL -> Asset#hasPolicy is not part of the database
            if (odrl['partOf']) {
                // TODO PAP#loadODRL -> Asset#partOf
            }
            break; // Asset

        case 'PartyCollection':
            if (odrl['refinement']) {
                // TODO PAP#loadODRL -> PartyCollection#refinement
            }
        case 'Party':
            if (odrl['partOf']) {
                // TODO PAP#loadODRL -> Party#partOf
            }
            break; // Party

        case 'Policy':
            if (odrl['inheritFrom']) {
                // TODO PAP#loadODRL -> Policy#inheritFrom
            }
            if (odrl['conflict']) {
                // TODO PAP#loadODRL -> Policy#conflict
            }
            if (odrl['permission']) {
                // TODO PAP#loadODRL -> Policy#permission
            }
            if (odrl['obligation']) {
                // TODO PAP#loadODRL -> Policy#obligation
            }
            if (odrl['prohibition']) {
                // TODO PAP#loadODRL -> Policy#prohibition
            }
            break; // Policy

        case 'Permission':
            if (odrl['duty']) {
                // TODO PAP#loadODRL -> Permission#duty
            }
        case 'Duty':
            if (odrl['consequence'] && odrl['@type'] === 'Duty') {
                // TODO PAP#loadODRL -> Duty#consequence
            }
        case 'Prohibition':
            if (odrl['remedy'] && odrl['@type'] === 'Prohibition') {
                // TODO PAP#loadODRL -> Prohibition#remedy
            }
        case 'Rule':
            if (odrl['failure']) {
                // TODO PAP#loadODRL -> Rule#failure
            }
            if (odrl['action']) {
                // TODO PAP#loadODRL -> Rule#action
            }
            if (odrl['target']) {
                // TODO PAP#loadODRL -> Rule#target
            }
            if (odrl['assignee']) {
                // TODO PAP#loadODRL -> Rule#assignee
            }
            if (odrl['assigner']) {
                // TODO PAP#loadODRL -> Rule#assigner
            }
            if (odrl['constraint']) {
                // TODO PAP#loadODRL -> Rule#constraint
            }
            break; // Rule

        case 'Constraint':
            if (odrl['operator']) {
                // TODO PAP#loadODRL -> Constraint#operator
            }
            if (odrl['leftOperand']) {
                // TODO PAP#loadODRL -> Constraint#leftOperand
            }
            if (odrl['rightOperand']) {
                // TODO PAP#loadODRL -> Constraint#leftOperand
            }
            break; // Constraint

        case 'LogicalConstraint':
            if (odrl['operand']) {
                // TODO PAP#loadODRL -> LogicalConstraint#operand
            }
            break; // LogicalConstraint


        case 'ConflictTerm':
        case 'Operator':
        case 'LeftOperand':
        case 'RightOperand':
            // NOTE PAP#loadODRL-> odrl-spec has no properties for these nodes
            break;

        default:
            throw `invalid type '${odrl['@type']}'`;

    } // switch

    queryBlocks.push(`WITH n SET n.blank = null`);

    return queryBlocks.join(" \n");

} // PAP~constructLoadQueries

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
                cypherQueries = odrlJSON['@graph'].map(constructLoadQuery);
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