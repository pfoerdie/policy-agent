/**
 * @module PolicyAgent.exec
 * @author Simon Petrac
 */

const { util: _ } = package = require("..");
module.exports = package._construct("exec", __dirname);

package.exec._load("findAction", "./findAction.cyp", _.minimizeStr);
package.exec._load("mergeAction", "./mergeAction.cyp", _.minimizeStr);
// package.exec._load("createAction", "./createAction.cyp", _.minimizeStr);

package.exec._require("Action", "./Action.js");
package.exec._require("register", "./register.js");
package.exec._require("define", "./define.js");
package.exec._require("enforce", "./enforce.js");
