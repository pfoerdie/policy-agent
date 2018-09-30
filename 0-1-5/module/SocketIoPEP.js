/**
 * @module PolicyAgent.PEP.socketIO
 * @author Simon Petrac
 */

const
    GenericPEP = require('../core/PEP.js'),
    SocketIO = require('socket.io');

//#region SocketIoPEP

/**
 * @name SocketIoPEP
 * @extends GenericPEP
 */
class SocketIoPEP extends GenericPEP {
    constructor(options = {}) {
        super(options);

        // TODO

    } // SocketIoPEP.constructor

} // SocketIoPEP

//#endregion SocketIoPEP

Object.defineProperty(GenericPEP, 'socketIO', {
    enumerable: true,
    value: SocketIoPEP
});