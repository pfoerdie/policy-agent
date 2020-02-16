/**
 * @module PolicyAgent.info
 * @author Simon Petrac
 */

const { util: _ } = package = require("..");
module.exports = package._construct("info", __dirname);

package.info._load("findAsset", "./findAsset.cyp");
package.info._load("findParty", "./findParty.cyp");

package.info._require("enforce", "./enforce.js");