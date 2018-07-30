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
 * Policy Information Point
 * @name PIP
 */
class PIP extends PolicyPoint {
    /**
     * @constructs PIP
     * @param {MongoStore} attributeStore 
     */
    constructor(attributeStore) {
        super('PIP');

        Object.defineProperties(this.param, {
            attributeStore: {
                value: Utility.validParam(param => param instanceof DataStore.MongoDB, attributeStore)
            }
        });
    } // PIP#constructor

    /**
     * @name PIP#ready
     * @inheritdoc
     */
    get ready() {
        return super.ready;
    } // PIP#ready<getter>

    /**
     * Enriches the odrlRequest attribute of a context.
     * @name PIP#_enrichRequest
     * @param {Context} context The Context to enrich.
     * @returns {Context} Same as the context argument.
     * @package
     * @async
     */
    async _enrichRequest(context) {
        context.log(`context reached ${this.toString('_enrichRequest')}`);

        let attrs = ['target', 'assignee', 'assigner'];
        let queries = attrs.map((attr) => {
            let prop = context.param.requestBody[attr] || context.param.requestSession[attr] || null;
            return prop;
        });

        let results = await this.param.attributeStore._retrieve(queries);

        results.forEach((result, index) => {
            try {

                if (result) {
                    let attr = attrs[index];

                    if (result['@type'] === '@set')
                        throw new Error(`multiple entries for requested ${attr}`);
                    if (result['@type'].toLowerCase === 'error')
                        throw result['@value'];

                    let
                        _odrl = result['_odrl'],
                        type = _odrl['@type'],
                        uid = _odrl['uid'];

                    if (typeof type !== 'string' && typeof uid !== 'string')
                        throw new Error(`_odrl must define @type and uid`);

                    delete result['_id'];
                    delete result['_odrl'];

                    if (!context.data.odrlRequest[attr])
                        context.data.odrlRequest[attr] = _odrl;

                    let cachedElem = context.data.requestCache.get(uid);

                    if (!cachedElem) {
                        cachedElem = {};
                        context.data.requestCache.set(uid, cachedElem);
                    }

                    Object.assign(cachedElem, result);
                }
            } catch (err) {
                context._audit('error', this.toString('_enrichRequest', null, `the result from the attributeStore had an invalid format`), err);
            }
        });

        return context;
    } // PIP#_enrichRequest

    async _assignData(context) {
        // IDEA PIP#_assignData -> um Daten im attributeStore zu aktualisieren
    } // PIP#_assignData

} // PIP

Utility.getPublicClass(PIP);
module.exports = PIP;