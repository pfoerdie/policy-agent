/**
 * @module PolicyAgent~PAP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    PolicyPoint = require(Path.join(__dirname, "PolicyPoint.js")),
    DataStore = require(Path.join(__dirname, "DataStore.js"));

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

    /**
     * @name PAP#ready
     * @inheritdoc
     */
    get ready() {
        return super.ready;
    } // PAP#ready<getter>

    async loadODRL(odrlJSON = {}) {
        if (Array.isArray(odrlJSON['@graph'])) {

            let
                nodenameMap = new Map(),
                queryBlocks = [];

            /**
             * Instanty pushes a cypher query to merge with the node in the store the first time a node gets requested.
             * @name PAP#loadODRL~mergeNode
             * @param {{@type: string, id: (string|undefined), uid: (undefined|string)}} node The requested node.
             * @returns {string} The name of the node to use in the cypher query.
             */
            function mergeNode(node) {
                let nodename;

                if (node['@type'] === 'Action') {
                    let mapID = "id:" + node['id'];

                    if (nodenameMap.has(mapID)) {
                        nodename = nodenameMap.get(mapID);
                    } else {
                        nodename = "n" + nodenameMap.size();
                        queryBlocks.push(`MERGE (${nodename}:ODRL:Action {id: "${node['id']}"})`);
                        nodenameMap.set(mapID, nodename);
                    }
                } else {
                    let mapID = "uid:" + node['uid'];

                    if (nodenameMap.has(mapID)) {
                        nodename = nodenameMap.get(mapID);
                    } else {
                        nodename = "n" + nodenameMap.size();
                        queryBlocks.push(`MERGE (${nodename}:ODRL:${node['@type']} {uid: "${node['uid']}"})`);
                        nodenameMap.set(mapID, nodename);
                    }
                }

                return nodename;
            } // PAP#loadODRL~mergeNode

            // TODO PAP#loadODRL -> hier muss ne gute Lösung her, um die Queries aufzubauen -> vllt mithilfe von rekursiven Funktionen

            // first merge all nodes in the graph
            odrlJSON['@graph'].forEach(mergeNode);

            // then connect the nodes as defined
            odrlJSON['@graph'].forEach((node, index) => {
                switch (node['@type']) {

                    case 'AssetCollection':
                        if (node['refinement']) {
                            // TODO PAP#loadODRL -> AssetCollection#refinement
                        }
                    case 'Asset':
                        // NOTE PAP#loadODRL -> Asset#hasPolicy is not part of the database
                        if (node['partOf']) {
                            Utility.toArray(node['partOf']).forEach((elem) => {
                                if (typeof elem === 'string') {
                                    // TODO PAP#loadODRL -> Asset#partOf
                                }
                            });
                        }
                        break; // Asset

                    case 'PartyCollection':
                        if (node['refinement']) {
                            // TODO PAP#loadODRL -> PartyCollection#refinement
                        }
                    case 'Party':
                        if (node['partOf']) {
                            // TODO PAP#loadODRL -> Party#partOf
                        }
                        break; // Party

                    case 'Policy':
                        if (node['inheritFrom']) {
                            // TODO PAP#loadODRL -> Policy#inheritFrom
                        }
                        if (node['conflict']) {
                            // TODO PAP#loadODRL -> Policy#conflict
                        }
                        if (node['permission']) {
                            // TODO PAP#loadODRL -> Policy#permission
                        }
                        if (node['obligation']) {
                            // TODO PAP#loadODRL -> Policy#obligation
                        }
                        if (node['prohibition']) {
                            // TODO PAP#loadODRL -> Policy#prohibition
                        }
                        break; // Policy

                    case 'Permission':
                        if (node['duty']) {
                            // TODO PAP#loadODRL -> Permission#duty
                        }
                    case 'Duty':
                        if (node['consequence'] && node['@type'] === 'Duty') {
                            // TODO PAP#loadODRL -> Duty#consequence
                        }
                    case 'Prohibition':
                        if (node['remedy'] && node['@type'] === 'Prohibition') {
                            // TODO PAP#loadODRL -> Prohibition#remedy
                        }
                    case 'Rule':
                        if (node['failure']) {
                            // TODO PAP#loadODRL -> Rule#failure
                        }
                        if (node['action']) {
                            // TODO PAP#loadODRL -> Rule#action
                        }
                        if (node['target']) {
                            // TODO PAP#loadODRL -> Rule#target
                        }
                        if (node['assignee']) {
                            // TODO PAP#loadODRL -> Rule#assignee
                        }
                        if (node['assigner']) {
                            // TODO PAP#loadODRL -> Rule#assigner
                        }
                        if (node['constraint']) {
                            // TODO PAP#loadODRL -> Rule#constraint
                        }
                        break; // Rule

                    case 'Action':
                        if (node['includedIn']) {
                            // TODO PAP#loadODRL -> Action#includedIn
                        }
                        if (node['implies']) {
                            // TODO PAP#loadODRL -> Action#implies
                        }
                        break; // Action

                    case 'Constraint':
                        if (node['operator']) {
                            // TODO PAP#loadODRL -> Constraint#operator
                        }
                        if (node['leftOperand']) {
                            // TODO PAP#loadODRL -> Constraint#leftOperand
                        }
                        if (node['rightOperand']) {
                            // TODO PAP#loadODRL -> Constraint#leftOperand
                        }
                        break; // Constraint

                    case 'LogicalConstraint':
                        if (node['operand']) {
                            // TODO PAP#loadODRL -> LogicalConstraint#operand
                        }
                        break; // LogicalConstraint


                    case 'ConflictTerm':
                    case 'Operator':
                    case 'LeftOperand':
                    case 'RightOperand':
                        // NOTE PAP#loadODRL-> odrl has no properties for these nodes
                        break; // RightOperand

                } // switch
            });

            console.log(queryBlocks.join(" \n"));
            // this.param.policyStore._execute(queryBlocks.join(" \n")).then(console.log).catch(console.error);

        } // if
    } // PAP#loadODRL

} // PAP

Utility.getPublicClass(PAP);
module.exports = PAP;