"use strict";
/**
 *数据包处理
 demon
 */
Object.defineProperty(exports, "__esModule", { value: true });
var SocketPackage = (function () {
    /**cmdtype 为-1则*/
    function SocketPackage(socketID, cmdtype, buffer) {
        if (cmdtype === void 0) { cmdtype = -1; }
        if (buffer === void 0) { buffer = null; }
        this._socket_id = socketID;
        if (cmdtype != -1) {
            this._cmd_type = cmdtype;
            this.initHead();
        }
        else {
            this.readBuffer(buffer);
        }
    }
    Object.defineProperty(SocketPackage.prototype, "socketID", {
        get: function () {
            return this._socket_id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SocketPackage.prototype, "cmdType", {
        get: function () {
            return this._cmd_type;
        },
        enumerable: true,
        configurable: true
    });
    SocketPackage.prototype.initHead = function () {
        this._buffer = new Buffer(10);
        this._buffer.writeInt8(0, 0);
        this._buffer.writeInt8(0, 1);
        this._buffer.writeInt32BE(0, 2);
        this._buffer.writeInt16BE(this._cmd_type, 6);
    };
    SocketPackage.prototype.readBuffer = function (buffer) {
        this._buffer = buffer;
        this._buffer.readInt8(0);
        this._buffer.readInt8(1);
        this._buffer.readUInt32BE(2);
        this._cmd_type = buffer.readInt16BE(6);
    };
    SocketPackage.prototype.putBytes = function (buffer) {
        this._buffer.writeInt16BE(buffer.byteLength, 8);
        this._buffer = Buffer.concat([this._buffer, buffer]);
    };
    Object.defineProperty(SocketPackage.prototype, "buffer", {
        get: function () {
            return this._buffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SocketPackage.prototype, "protoBuf", {
        get: function () {
            this._info_length = this._buffer.readInt16BE(8);
            var buf = new Buffer(this._info_length);
            this._buffer.copy(buf, 0, 10);
            return buf;
        },
        enumerable: true,
        configurable: true
    });
    return SocketPackage;
}());
exports.SocketPackage = SocketPackage;
