/** @module PolicyAgent.exec */

const { util: _ } = package = require("..");
module.exports = package._construct("exec", __dirname);

package.exec._load("findAction", "./findAction.cyp", package.repo.bindQuery);
package.exec._load("mergeAction", "./mergeAction.cyp", package.repo.bindQuery);
// package.exec._load("createAction", "./createAction.cyp", package.repo.bindQuery);

package.exec._require("Action", "./Action.js");
package.exec._require("register", "./register.js");
package.exec._require("define", "./define.js");
package.exec._require("enforceActions", "./enforceActions.js");
