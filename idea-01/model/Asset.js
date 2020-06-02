const { util: _ } = $ = require("../index.js");
const { entities } = _.cache.match($.model);
const create_asset = $.repo.bindQuery(_.file(__dirname, "./Asset/create_asset.cyp").openSync());

class Asset extends $.model.Entity {

    static async create() { }
    async read() { }
    async update() { }
    async delete() { }

}

_.cache.add(Asset);
module.exports = Asset;