const cache = new WeakMap();

/** 
 * The cache object that gets associated with the target.
 * @typedef {Object} Cache 
 */
class Cache { }

/**
 * @param {Object} target 
 * @return {Boolean}
 */
exports.add = function (target) {
    if (cache.has(target))
        return false;
    cache.set(target, new Cache());
    return true;
};

/**
 * @param {Object} target 
 * @returns {Cache} 
 */
exports.match = function (target) {
    return cache.get(target);
};

/**
 * @param {Object} target 
 * @param {Object} value 
 */
exports.put = function (target, value) {
    if (cache.has(target))
        Object.assign(cache.get(target), value);
    else
        cache.set(target, Object.assign(new Cache(), value));
};

/**
 * @param {Object} target 
 * @returns {Boolean} 
 */
exports.delete = function (target) {
    return cache.delete(target);
};