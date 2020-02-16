/**
 * @module PolicyAgent.exec
 * @author Simon Petrac
 */

const { util: _ } = package = require("..");
module.exports = package._construct("exec", __dirname);

package.exec._load("findActions", "./findActions.cyp");
package.exec._load("registerAction", "./registerAction.cyp");

package.exec._require("register", "./register.js");
package.exec._require("define", "./define.js");
package.exec._require("enforce", "./enforce.js");
