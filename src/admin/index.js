/**
 * @module PolicyAgent.admin
 * @author Simon Petrac
 */

const { util: _ } = package = require("..");
module.exports = package._construct("admin", __dirname);

package.admin._require("login", "./login.js");
package.admin._require("audit", "./audit.js");