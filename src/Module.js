const
    assert = require("assert"),
    Path = require("path"),
    Fs = require("fs"),
    _re_key = /^\w+$/,
    _re_identifier = /^(?:\w+\.)*\w+$/,
    _re_require_id = /^(?:\w+\.)*(?:\w+|\*)$/,
    _re_directory = /.+/;

class Module {

    constructor(id, directory) {
        assert(_re_identifier.test(id), "invalid id");
        assert(_re_directory.test(directory), "invalid directory");
        Object.defineProperties(this, {
            id: { value: id },
            dir: { value: directory }
        });
    }

    _define(id, value) {
        assert(_re_identifier.test(id), "invalid id");
        let target = this, stack = id.split("."), key = stack.shift();
        while (stack.length > 0) {
            assert(target[key] instanceof Module, "invalid target");
            target = target[key];
            key = stack.shift();
        }
        assert(!Reflect.has(target, key), "id already used");
        const child = value;
        if (child instanceof Object) Object.defineProperty(child, "id", { value: `${target.id}.${key}` });
        Object.defineProperty(target, key, { value: child });
        return child;
    }

    _add(id, value) {
        assert(_re_identifier.test(id), "invalid id");
        let target = this, stack = id.split("."), key = stack.shift();
        while (stack.length > 0) {
            assert(target[key] instanceof Module, "invalid target");
            target = target[key];
            key = stack.shift();
        }
        assert(!Reflect.has(target, key), "id already used");
        const child = value;
        if (child instanceof Object) Object.defineProperty(child, "id", { value: `${target.id}.${key}` });
        Object.defineProperty(target, key, { value: child });
        return child;
    }

    _construct(id, directory) {
        assert(_re_identifier.test(id), "invalid id");
        let target = this, stack = id.split("."), key = stack.shift();
        while (stack.length > 0) {
            assert(target[key] instanceof Module, "invalid target");
            target = target[key];
            key = stack.shift();
        }
        assert(!Reflect.has(target, key), "id already used");
        const child = new Module(`${target.id}.${key}`, directory);
        Object.defineProperty(target, key, { value: child, enumerable: true });
        return child;
    }

    _require(id, location) {
        assert(_re_require_id.test(id), "invalid id");
        assert(_re_directory.test(location), "invalid location");
        let target = this, stack = id.split("."), key = stack.shift();
        while (stack.length > 0) {
            assert(target[key] instanceof Module, "invalid target");
            target = target[key];
            key = stack.shift();
        }
        if (key === "*") {
            const path = Path.join(this.dir, location);
            const pack = require(path);
            assert(pack instanceof Object, "invalid pack");
            for (let [key, child] of Object.entries(pack)) {
                assert(_re_key.test(key), "invalid key");
                assert(!Reflect.has(target, key), "id already used");
                if (child instanceof Object) Object.defineProperty(child, "id", { value: `${target.id}.${key}` });
                Object.defineProperty(target, key, { value: child, enumerable: true });
            }
        } else {
            assert(!Reflect.has(target, key), "id already used");
            const path = Path.join(this.dir, location);
            const child = require(path);
            if (child instanceof Object) Object.defineProperty(child, "id", { value: `${target.id}.${key}` });
            Object.defineProperty(target, key, { value: child, enumerable: true });
            return child;
        }
    }

    _load(id, location, parser) {
        assert(_re_identifier.test(id), "invalid id");
        assert(_re_directory.test(location), "invalid location");
        let target = this, stack = id.split("."), key = stack.shift();
        while (stack.length > 0) {
            assert(target[key] instanceof Module, "invalid target");
            target = target[key];
            key = stack.shift();
        }
        assert(!Reflect.has(target, key), "id already used");
        const path = Path.join(this.dir, location);
        const file = Fs.readFileSync(path).toString();
        const child = typeof parser === "function" ? parser(file) : file;
        if (child instanceof Object) {
            Object.defineProperty(child, "id", { value: `${target.id}.${key}` });
            Object.defineProperty(target, key, { value: child, enumerable: true });
        } else {
            Object.defineProperty(target, key, { value: child });
        }
        return child;
    }

} // Package

module.exports = Module;