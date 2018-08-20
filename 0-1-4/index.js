/**
 * @module PolicyAgent~SystemComponent
 * @author Simon Petrac
 */

const
    Path = require('path'),
    SystemComponent = require(Path.join(__dirname, "SystemComponent.js")),
    Context = require(Path.join(__dirname, "Context.js"));

(async (/* TESTING */) => {

    let c = new Context();

    // NOTE was cooleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeees

    // c.throw('test', 'lorem ipsum');

    return 0;

})(/* TESTING */).then(console.log).catch(console.error);


