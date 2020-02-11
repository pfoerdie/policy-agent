const
    Path = require("path"),
    Fs = require("fs"),
    _ = require("./tools"),
    $dir = Symbol();

class Package {

    constructor(directory) {
        _.assert.string(directory, 1);
        _.define(this, $dir, directory);
    }

    construct(key, directory) {
        _.assert(/^\w+$/.test(key), "invalid key");
        let value = new Package(directory);
        _.enumerate(this, key, value);
        return value;
    }

    define(key, value) {
        _.assert(/^(?:\w+\.)*\w+$/.test(key), "invalid key");
        let target = this, path = key.split("."), current = path.shift();
        while (path.length > 0) {
            _.assert(target[current] instanceof Object, "invalid path");
            target = target[current];
            current = path.shift();
        }
        _.define(target, current, value);
    }

    add(key, fileName) {
        _.assert(/^(?:\w+\.)*\w+$/.test(key), "invalid key");
        let filePath = Path.join(this[$dir], fileName);
        _.assert(Fs.existsSync(filePath), "file does not exist");
        let target = this, path = key.split("."), current = path.shift();
        while (path.length > 0) {
            _.assert(target[current] instanceof Object, "invalid path");
            target = target[current];
            current = path.shift();
        }
        _.assert(!Reflect.has(target, current), "path already used");
        let result = (fileName.endsWith(".js") || fileName.endsWith(".json"))
            ? require(filePath) : Fs.readFileSync(filePath).toString();
        _.enumerate(target, current, result);
    }

} // Package

module.exports = Package;