/** @module PolicyAgent.util */

const package = require("..");
module.exports = package._construct("util", __dirname);

package.util._require("*", "./core.js");
package.util._require("private", "./private.js");
package.util._require("is", "./is.js");
package.util._require("assert", "./assert.js");
package.util._require("log", "./log.js");