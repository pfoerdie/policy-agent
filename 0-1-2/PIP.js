/**
 * @module PolicyAgent~PIP
 * @author Simon Petrac
 */

const
    Path = require('path'),
    Utility = require(Path.join(__dirname, "Utility.js")),
    PolicyPoint = require(Path.join(__dirname, "PolicyPoint.js")),
    DataStore = require(Path.join(__dirname, "DataStore.js"));

/**
 * @name PIP
 */
class PIP extends PolicyPoint {

    constructor(attributeStore) {
        if (!(attributeStore instanceof DataStore.MongoDB))
            throw new Error(Utility.descColorScheme('PIP', null, 'constructor', 'attributeStore') + ` -> invalid attributeStore`);

        super('PIP');

        this.data.attributeStore = attributeStore;
    } // PIP#constructor

    /**
     * @name PIP#ready
     * @inheritdoc
     */
    get ready() {
        return super.ready;
    } // PIP#ready<getter>

    async _fillData(context) {
        // TODO PIP#_fillData -> context.data mit richtigen informationen füllen, basierend auf context.param und context.session
        context.log(`context reached ${this.toString('_fillData')}`);

        let properties = ['target', 'assignee', 'assigner']
            .map(attr => [attr, context._get(attr)])
            .filter(([attr, prop]) => prop);

        let
            queries = properties.map(([attr, prop]) => prop),
            results = await this.data.attributeStore._retrieve(queries);

        for (let index in results) {
            if (results[index] && results[index]['@type'] !== '@set') {
                context.data[properties[index][0 /* <- attr */]] = results[index];
            }
        }

        return context;
    } // PIP#_fillData

    async _assignData(context) {

        // TODO PIP#_assignData -> hier mal was überlegen

    } // PIP#_assignData

} // PIP

Utility.getPublicClass(PIP);
module.exports = PIP;