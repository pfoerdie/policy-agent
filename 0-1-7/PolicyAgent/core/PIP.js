/**
 * Policy Information Point
 * @module PolicyAgent.PIP
 * @author Simon Petrac
 */

const
    PolicyPoint = require('./PolicyPoint.js'),
    SP = require('./SP.js'),
    RP = require('./RP.js'),
    EP = require('./EP.js');

/**
 * @name _handleQuery
 * @param {(Array|*)} queryArr 
 * @param {function[]} queryFnArr 
 * @returns {Array}
 * @async
 * @private
 */
async function _handleQuery(queryArr, queryFnArr) {
    if (!queryArr) return;
    if (!Array.isArray(queryArr)) queryArr = [queryArr];

    let resultArr = [];
    await Promise.all(queryArr.map((elem, index) => Promise.all(
        elem ? queryFnArr.map(async (queryFn) => {
            let result = await queryFn(elem);
            if (resultArr[index] === undefined)
                resultArr[index] = result;
        }) : undefined
    )));

    return resultArr;
} // _handleQuery

/**
 * @name PIP
 * @extends PolicyAgent.PolicyPoint
 * @class
 */
class PIP extends PolicyPoint {
    /**
     * @constructs PIP
     * @param {JSON} [options={}]
     * @param {Array<PolicyAgent.SP>} [options.subject=[]]
     * @param {Array<PolicyAgent.RP>} [options.resource=[]]
     * @param {Array<PolicyAgent.EP>} [options.environment=[]]
     * @public
     */
    constructor(options = {}) {
        super(options);

        this.data.SPs = Array.isArray(options['subject'])
            ? options['subject']
                .map(elem => typeof elem === 'string' ? PolicyPoint.get(elem) : elem)
                .filter(elem => elem instanceof SP)
            : undefined;

        this.data.RPs = Array.isArray(options['resource'])
            ? options['resource']
                .map(elem => typeof elem === 'string' ? PolicyPoint.get(elem) : elem)
                .filter(elem => elem instanceof RP)
            : undefined;

        this.data.EPs = Array.isArray(options['environment'])
            ? options['environment']
                .map(elem => typeof elem === 'string' ? PolicyPoint.get(elem) : elem)
                .filter(elem => elem instanceof EP)
            : undefined;

    } // PIP.constructor

    /**
     * TODO wichtig!
     * der RP und der SP sollen undefined zurückgeben, wenn die collection nicht existiert
     * => Promise.race funktioniert nicht. Es muss das erste Object genommen werden, das nicht undefined ist, oder so ähnlich!
     * (aktuelle Lösung mit timeoutPromise ist wahrscheinlich nicht die beste)
     */

    /**
     * @name PIP#_subjectRequest
     * @param {object} query 
     * @param {object[]} [query.find]
     * @param {object[]} [query.create]
     * @param {object[]} [query.update]
     * @param {object[]} [query.delete]
     * @return {{find: object[], create: boolean[], update: boolean[], delete: boolean[]}}
     * @async
     */
    async _subjectRequest(query) {
        if (this.data.SPs.length === 0)
            this.throw('_subjectRequest', new Error(`no SP connected`));
        if (!query || typeof query !== 'object')
            this.throw('_subjectRequest', new TypeError(`invalid argument`));

        let result = await Promise.all([
            _handleQuery(query.find, this.data.SPs.map(sP => sP._find.bind(sP))),
            _handleQuery(query.create, this.data.SPs.map(sP => sP._create.bind(sP))),
            _handleQuery(query.update, this.data.SPs.map(sP => sP._update.bind(sP))),
            _handleQuery(query.delete, this.data.SPs.map(sP => sP._delete.bind(sP)))
        ]); // result

        return { find: result[0], create: result[1], update: result[2], delete: result[3] };
    } // PIP#_subjectRequest

    /**
     * @name PIP#_resourceRequest
     * @param {object} query 
     * @param {object[]} [query.find]
     * @param {object[]} [query.create]
     * @param {object[]} [query.update]
     * @param {object[]} [query.delete]
     * @return {{find: object[], create: boolean[], update: boolean[], delete: boolean[]}}
     * @async
     */
    async _resourceRequest(query) {
        if (this.data.RPs.length === 0)
            this.throw('_resourceRequest', new Error(`no RP connected`));
        if (!query || typeof query !== 'object')
            this.throw('_resourceRequest', new TypeError(`invalid argument`));

        let result = await Promise.all([
            _handleQuery(query.find, this.data.RPs.map(rP => rP._find.bind(rP))),
            _handleQuery(query.create, this.data.RPs.map(rP => rP._create.bind(rP))),
            _handleQuery(query.update, this.data.RPs.map(rP => rP._update.bind(rP))),
            _handleQuery(query.delete, this.data.RPs.map(rP => rP._delete.bind(rP)))
        ]); // result

        return { find: result[0], create: result[1], update: result[2], delete: result[3] };
    } // PIP#_resourceRequest

    /**
     * @name PIP#_environmentRequest
     * @param {[object]} query 
     * TODO jsDoc
     */
    async _environmentRequest(query) {
        if (this.data.EPs.length === 0)
            this.throw('_environmentRequest', new Error(`no EP connected`));
        if (!query || typeof query !== 'object')
            this.throw('_environmentRequest', new TypeError(`invalid argument`));

        let result = await Promise.all([
            _handleQuery(query.find, this.data.EPs.map(eP => eP._find.bind(eP)))
        ]); // result

        return { find: result[0] };
    } // PIP#_environmentRequest

} // PIP

module.exports = PIP;