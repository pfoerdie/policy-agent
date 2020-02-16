/**
 * @module PolicyAgent.repo
 * @author Simon Petrac
 */

const { util: _ } = package = require("..");
module.exports = package._construct("repo", __dirname);

package.repo._require("Record", "./Record.js");
package.repo._require("connect", "./connect.js");
// package.repo._require("disconnect", "./disconnect.js"); // TODO rethink about removing this for security reasons and no real purpose
package.repo._require("ping", "./ping.js");
package.repo._require("query", "./query.js");