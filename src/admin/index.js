/**
 * @module PolicyAgent.admin
 * @author Simon Petrac
 */

const { util: _ } = package = require("..");
module.exports = package._construct("admin", __dirname);

package.admin._load("setupNodes", "./setupNodes.cyp", _.minimizeStr);
package.admin._load("setupConstraints", "./setupConstraints.cyp", _.minimizeStr);

package.admin._require("setup", "./setup.js");
package.admin._require("login", "./login.js");
package.admin._require("audit", "./audit.js");