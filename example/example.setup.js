const PolicyAgent = require("..");

module.exports = (async (/* async iife */) => {

    // PolicyAgent.repo.connect("localhost", "neo4j", "odrl");

    await _package.repo.query("MATCH (n) DETACH DELETE n");

    await PolicyAgent.admin.setup();

    await Promise.all([
        await PolicyAgent.exec.register("read", "use"),
        await PolicyAgent.exec.register("http:GET", "read", ["lorem_ipsum"]),
        await PolicyAgent.exec.register("hello_world", "use", ["read", "lorem_ipsum"]),
        await PolicyAgent.exec.register("lorem_ipsum", "use")
    ]);

})(/* async iife */);