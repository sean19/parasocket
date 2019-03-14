"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketPackage {
    /**cmdtype 为-1则*/
    constructor(serverName, cmdtype = -1) {
        this._head_length = 10;
        this.socketid = 0;
        this._index = 0;
        this.can_send = false;
        this.serverName = serverName;
        if (cmdtype != -1) {
            this._cmd_type = cmdtype;
            this.initHead();
        }
    }
    get cmdType() {
        return this._cmd_type;
    }
    initHead() {
        this._buffer = Buffer.alloc(10);
        // this._buffer.writeInt8(0,0);
        // this._buffer.writeInt8(0,1);
        this._buffer.writeUInt32BE(0, SocketPackage.idx_protolen);
        this._buffer.writeUInt32BE(this._cmd_type, SocketPackage.idx_cmdid);
    }
    readBuffer(u8a) {
        var buffer = new Buffer(u8a);
        var h1 = buffer.readInt8(0);
        var h12 = buffer.readInt8(1);
        this._info_length = buffer.readUInt32BE(SocketPackage.idx_protolen);
        this._cmd_type = buffer.readUInt32BE(SocketPackage.idx_cmdid);
        var bufferlen = this._head_length + this._info_length;
        if (buffer.length < bufferlen) {
            this.can_send = false;
            return u8a;
        }
        this._buffer = new Buffer(buffer.subarray(0, bufferlen));
        var u8a2 = u8a.subarray(bufferlen);
        var len = u8a2.length;
        this.can_send = true;
        return u8a2;
    }
    putBytes(buffer) {
        var len = this._buffer.writeUInt32BE(buffer.byteLength, SocketPackage.idx_protolen);
        this._buffer = Buffer.concat([this._buffer, buffer]);
    }
    get buffer() {
        return this._buffer;
    }
    get protoBuf() {
        this._info_length = this._buffer.readInt32BE(SocketPackage.idx_protolen);
        var buf = new Buffer(this._info_length);
        this._buffer.copy(buf, 0, SocketPackage.len_head);
        return buf;
    }
}
SocketPackage.pkg_index = 0;
SocketPackage.len_head = 10;
SocketPackage.idx_socketid = 0;
SocketPackage.idx_protolen = 2;
SocketPackage.idx_cmdid = 6;
exports.SocketPackage = SocketPackage;
//# sourceMappingURL=SocketPackage.js.map