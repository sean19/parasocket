"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParaSocket_1 = require("../ParaSocket");
class SocketData {
    constructor(socketname, socketID) {
        this._socket_id = 0;
        this._socket_id = socketID;
        this.socketName = socketname;
    }
    get socketID() {
        return this._socket_id;
    }
    set socketID(idd) {
        ParaSocket_1.ParaSocket._log.log("错误赋值--!!!!!!!紧急通知||||||||||||||||||||||||");
    }
    getid() {
        return this.socketID;
    }
    dispose() {
        this.clear();
    }
    clear() {
    }
}
exports.SocketData = SocketData;
//# sourceMappingURL=SocketData.js.map