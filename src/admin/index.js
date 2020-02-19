/** @module PolicyAgent.admin */

const { util: _ } = package = require("..");
module.exports = package._construct("admin", __dirname);

package.admin._load("setupNodes", "./setupNodes.cyp", package.repo.bindQuery);
package.admin._load("setupConstraints", "./setupConstraints.cyp", package.repo.bindQuery);

package.admin._require("setup", "./setup.js");
package.admin._require("login", "./login.js");
package.admin._require("audit", "./audit.js");