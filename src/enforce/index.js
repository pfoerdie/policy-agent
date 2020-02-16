/**
 * @module PolicyAgent.enforce
 * @author Simon Petrac
 */

const { util: _ } = package = require("..");
module.exports = package._construct("enforce", __dirname);

package.enforce._require("Context", "./Context.js");
package.enforce._require("request", "./request.js");
package.enforce._require("express", "./express.js");
package.enforce._require("io", "./io.js");