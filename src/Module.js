const
    Path = require("path"),
    Fs = require("fs"),
    _ = require("./tools"),
    _re_identifier = /^(?:\w+\.)*\w+$/,
    _private = new WeakMap();

class Module {

    constructor(id, directory) {
        _.assert(_re_identifier.test(id), "invalid id");
        _.assert.string(directory, 1);
        _.define(this, "id", id);
        _.define(this, "dir", directory);
        _private.set(this, {});
    }

    private(instance) {
        // _.log(this, "private", instance);
        _.assert(_private.has(instance), "instance not found");
        return _private.get(instance);
    }

    define(id, value) {
        // _.log(this, "define", id, value);
        _.assert(_re_identifier.test(id), "invalid key");
        let target = this, stack = id.split("."), key = stack.shift();
        while (stack.length > 0) {
            _.assert(target[key] instanceof Module, "invalid target");
            target = target[key];
            key = stack.shift();
        }
        _.assert(!Reflect.has(target, key), "id already used");
        const child = value;
        if (child instanceof Object) _.define(child, "id", `${this.id}.${id}`);
        _.define(target, key, child);
        return child;
    }

    add(id, value) {
        // _.log(this, "add", id, value);
        _.assert(_re_identifier.test(id), "invalid key");
        let target = this, stack = id.split("."), key = stack.shift();
        while (stack.length > 0) {
            _.assert(target[key] instanceof Module, "invalid target");
            target = target[key];
            key = stack.shift();
        }
        _.assert(!Reflect.has(target, key), "id already used");
        const child = value;
        if (child instanceof Object) _.define(child, "id", `${this.id}.${id}`);
        _.enumerate(target, key, child);
        return child;
    }

    construct(id, directory) {
        // _.log(this, "construct", id, directory);
        _.assert(_re_identifier.test(id), "invalid key");
        let target = this, stack = id.split("."), key = stack.shift();
        while (stack.length > 0) {
            _.assert(target[key] instanceof Module, "invalid target");
            target = target[key];
            key = stack.shift();
        }
        _.assert(!Reflect.has(target, key), "id already used");
        const child = new Module(`${target.id}.${key}`, directory);
        _.enumerate(target, key, child);
        return child;
    }

    require(id, location) {
        // _.log(this, "require", id, location);
        _.assert(_re_identifier.test(id), "invalid id");
        _.assert.string(location, 1);
        let target = this, stack = id.split("."), key = stack.shift();
        while (stack.length > 0) {
            _.assert(target[key] instanceof Module, "invalid target");
            target = target[key];
            key = stack.shift();
        }
        _.assert(!Reflect.has(target, key), "id already used");
        const path = Path.join(this.dir, location);
        const child = require(path);
        if (child instanceof Object) _.define(child, "id", `${this.id}.${id}`);
        _.enumerate(target, key, child);
        return child;
    }

    load(id, location) {
        // _.log(this, "load", id, location);
        _.assert(_re_identifier.test(id), "invalid id");
        _.assert.string(location, 1);
        let target = this, stack = id.split("."), key = stack.shift();
        while (stack.length > 0) {
            _.assert(target[key] instanceof Module, "invalid target");
            target = target[key];
            key = stack.shift();
        }
        _.assert(!Reflect.has(target, key), "id already used");
        const path = Path.join(this.dir, location);
        const child = Fs.readFileSync(path).toString();
        if (child instanceof Object) _.define(child, "id", `${this.id}.${id}`);
        _.define(target, key, child);
        return child;
    }

} // Package

module.exports = Module;