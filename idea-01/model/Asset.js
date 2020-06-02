const { util: _ } = $ = require("../index.js");
const { entities } = _.cache.match($.model);
const create_asset = $.repo.requireQuery(__dirname, "./Asset/create_asset.cyp");

class Asset extends $.model.Entity {

    static async create() { }
    async read() { }
    async update() { }
    async delete() { }

}

_.cache.add(Asset);
module.exports = Asset;