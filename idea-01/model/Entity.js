const { util: _ } = $ = require("../index.js");
const { entities } = _.cache.match($.model);

class Entity {

    constructor(uid) {
        _.assert(new.target !== Entity, "this class is abstract");
        _.assert(_.is.string.uid(uid), "invalid uid");
        _.assert(!entities.has(uid), "entity exists already");
        Object.defineProperty(this, "uid", {
            value: uid,
            enumerable: true
        });
        entities.set(uid, this);
    }

    static async use(uid) {
        _.assert(_.is.string.uid(uid), "invalid uid");
        if (entities.has(uid))
            return entities.get(uid);

        const records = await $.repo.query(
            "MATCH (n:Entity { uid: $uid })\n" +
            "RETURN labels(n) AS type",
            { uid }
        );
        _.assert(records.length === 1);

        /** @type {Array<String>} */
        const typeArr = records[0].type;
        _.assert(_.is.array(typeArr) && typeArr.length === 2);
        /** @type {String} */
        const type = typeArr.find(val => val !== "Entity");

        if (entities.has(uid))
            return entities.get(uid);
        const typeClass = $.model[type];
        assert(typeClass);
        return new typeClass(uid);
    }

}

_.cache.add(Entity);
module.exports = Entity;