const
    Path = require("path"),
    Fs = require("fs");

/**
 * @typedef {Object} File
 * @property {string} path
 * @property {undefined|null|Buffer} buffer
 * 
 * @constructs File
 * @param  {...string} pathSegments 
 * @returns {File}
 */
function File(...pathSegments) {
    if (!new.target) return new File(...pathSegments);
    this.path = Path.join(...pathSegments);
    this.buffer = undefined;
}

/**
 * @returns {File} this
 */
File.prototype.open = function open() {
    return new Promise((resolve, reject) => {
        Fs.readFile(this.path, (err, data) => {
            if (err) {
                this.buffer = null;
                reject(err);
            } else {
                this.buffer = data;
                resolve(this);
            }
        })
    });
}

/**
 * @returns {File} this
 */
File.prototype.save = function save() {
    return new Promise((resolve, reject) => {
        Fs.writeFile(this.path, this.buffer, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        })
    });
}

/**
 * @returns {File} this
 */
File.prototype.openSync = function openSync() {
    try {
        this.buffer = Fs.readFileSync(this.path);
        return this;
    } catch (err) {
        this.buffer = null;
        throw err;
    }
};

/**
 * @returns {undefined|null|string}
 */
File.prototype.toString = function toString() {
    return this.buffer ? this.buffer.toString() : this.buffer;
};

module.exports = File;