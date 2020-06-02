const { util: _ } = $ = require("../index.js");
const { entities } = _.cache.match($.model);

class AssetCollection extends $.model.Entity {

    static async create() { }
    async list() { }
    async append() { }
    async remove() { }
    async delete() { }

}

_.cache.add(AssetCollection);
module.exports = AssetCollection;