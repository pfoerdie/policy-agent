/**
 * @module PolicyAgent.PEP.socketIO
 * @author Simon Petrac
 */

const
    PEP = require('../core/PEP.js'),
    SocketIO = require('socket.io');

/**
 * @name SocketIoPEP
 * @extends PEP
 */
class SocketIoPEP extends PEP {
    constructor(options = {}) {
        super(options);

        // TODO

    } // SocketIoPEP.constructor

} // SocketIoPEP

Object.defineProperty(PEP, 'socketIO', {
    enumerable: true,
    value: SocketIoPEP
});