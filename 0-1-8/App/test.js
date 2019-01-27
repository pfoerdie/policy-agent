(async (/* closure */) => {

    //#region PolicyAgent

    const
        Path = require('path'),
        PolicyAgent = require('../PolicyAgent');

    /**
     * -> Desktop:
     * /d/Programme/Neo4j/neo4j-community-3.4.0/bin/neo4j.bat console
     * /d/Programme/MongoDB/mongodb-community-4.0.0/bin/mongod --dbpath=D:/Programme/MongoDB/databases/examplePIPdataBase
     * 
     * -> IdeaPad:
     * /d/Programme/Neo4j/neo4j-community-3.4.5/bin/neo4j.bat console
     * /d/Programme/MongoDB/mongodb-community-4.0.0/bin/mongod --dbpath=D:/Programme/MongoDB/databases/examplePIPdataBase
     */

    let
        myPIP = new PolicyAgent.PIP({
            '@id': "/PIP/the-worlds-attributes",
            'dbName': "SubjectsPoint"
        }),
        myPAP = new PolicyAgent.PAP({
            '@id': "/PIP/the-worlds-policies",
            'password': "odrl"
        }),
        myPDP = new PolicyAgent.PDP({
            '@id': "/PDP/access-to-the-world",
            'PAP': myPAP,
            'PIP': myPIP
        }),
        myPEP = new PolicyAgent.PEP({
            '@id': "/PEP/hello-world",
            'PDP': myPDP,
            'root': Path.join(__dirname, "webapp")
        });

    // myPEP.defineAction('read', 'use', undefined, target => target['@value'].toString());
    // myPEP.defineAction('login', 'use', undefined, target => {
    //     console.log(target);
    //     // TODO die Session wird hier benötigt
    //     return false;
    // });

    //#endregion PolicyAgent

    //#region Test

    let
        sessionID = undefined,
        param = {
            'action': "use",
            'target': {
                '@type': "File",
                '@id': "/login"
            },
            'assigner': undefined,
            'assignee': undefined
        },
        result = await myPEP.request(sessionID, param /*, ...args*/);

    console.log(result);

    //#endregion Test

})(/* closure */)
    .catch(err =>
        console.error(err)
    );
    // .catch(err => null);