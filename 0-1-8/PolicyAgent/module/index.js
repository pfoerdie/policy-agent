const
    Path = require('path'),
    load = (mod) => require(Path.join(__dirname, mod + ".js"));

module.exports = ({ PEP }) => ({
    PEP: {
        express: load('PEP.express')(PEP),
        socketIO: load('PEP.socketIO')(PEP)
    },
    PIP: {
        FS: null
    }
}); // module.exports