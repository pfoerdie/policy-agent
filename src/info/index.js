/**
 * @module PolicyAgent.info
 * @author Simon Petrac
 */

const { util: _ } = package = require("..");
module.exports = package._construct("info", __dirname);

package.info._load("findAsset", "./findAsset.cyp", _.minimizeStr);
package.info._load("findParty", "./findParty.cyp", _.minimizeStr);

package.info._require("Entity", "./Entity.js");
package.info._require("Asset", "./Asset.js");
package.info._require("Party", "./Party.js");

package.info._require("enforce", "./enforce.js");