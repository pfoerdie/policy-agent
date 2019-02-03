(async (/* closure */) => {

    //#region PolicyAgent

    const
        Path = require('path'),
        Fs = require('fs'),
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
            'dbName': "InformationPoint"
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

    myPEP.defineAction('read', async function (session, ...args) {
        let target = await this.target();
        if (target['@type'] !== 'File')
            throw new Error("can only read files");

        return await new Promise((resolve, reject) => {
            let filepath = Path.join(__dirname, 'webapp', target['path']);
            let filetype = target['mimeType'];
            Fs.readFile(filepath, (err, buffer) => {
                if (err)
                    return reject(err);

                let result = { 'type': filetype, 'value': buffer.toString() };
                resolve(result);
            });
        });
    }, 'use', undefined);

    // myPEP.defineAction('login', 'use', undefined, target => {
    //     console.log(target);
    //     // TODO die Session wird hier benötigt
    //     return false;
    // });

    //#endregion PolicyAgent

    await new Promise(resolve => setImmediate(resolve));

    //#region Test

    let
        session = { 'id': "test-session" },
        param = {
            'action': "read",
            'target': {
                '@type': "File",
                '@id': "/"
            },
            'assigner': undefined,
            'assignee': {
                '@type': "User",
                'username': "pfoerdie",
                'sha256PW': "Cn4n8u3dN7ta/LrXzRy39OD5g48fV29kjbePSB/Ea5s="
            }
        },
        result = await myPEP.request(param, session /*, ...args*/);

    console.log(result);

    //#endregion Test

    return null;

})(/* closure */)
    .catch(err =>
        console.error(err)
    );
    // .catch(err => null);