"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParaSocket_1 = require("../ParaSocket");
const SocketMessageRecever_1 = require("./SocketMessageRecever");
const EnumSocketEvent_1 = require("../socketEvent/EnumSocketEvent");
const TcpClientBase_1 = require("../core/TcpClientBase");
class ServerTCPClient extends TcpClientBase_1.TcpClientBase {
    constructor(infoClient) {
        super(infoClient);
        this._is_alive = true;
        this.inputPkgList = [];
        this.handlling = false;
        this.receiver = new SocketMessageRecever_1.SocketMessageRecever(this.onReceivePkg.bind(this));
        //  new SocketDataServer(infoClient.serverName, infoClient.id);
        this.addEvent();
    }
    onmessage(u8a) {
        if (this._is_alive == false)
            return;
        this.receiver.receiveData(this.infoClient.serverName, u8a);
    }
    onReceivePkg(pkg) {
        this.inputPkgList.push(pkg);
        this.loopHandlerPkgList();
    }
    async loopHandlerPkgList() {
        if (this.handlling || this.inputPkgList.length == 0) {
            return;
        }
        this.handlling = true;
        let pkg = this.inputPkgList.shift();
        try {
            await this.handlerPkg(pkg);
        }
        catch (e) {
            ParaSocket_1.ParaSocket.log("句柄解析错误:" + pkg.cmdType + ":" + (e.stack || e));
        }
        finally {
            this.handlling = false;
            this.loopHandlerPkgList();
        }
    }
    sendPkg(pkg) {
        try {
            if (this._is_alive) {
                this.infoClient.socket.write(pkg.buffer);
            }
        }
        catch (err) {
            ParaSocket_1.ParaSocket._log.onErr("sendPkg failed");
        }
    }
    getid() {
        if (this.infoClient) {
            return this.infoClient.id;
        }
        return -1000;
    }
    getisactive() {
        return this._is_alive;
    }
    //====================================================================
    dispose() {
        if (this._is_alive == false) {
            return;
        }
        ParaSocket_1.ParaSocket.socketEventCenter.callEvent(EnumSocketEvent_1.EnumSocketEvent.server_client_disConnect, [this.infoClient.serverName, this.getid()]);
        ParaSocket_1.ParaSocket.log('客户端断开连接,socketId=' + this.getid() + "server:" + this.infoClient.serverName + "::" + this.infoClient.ipAddress + ":" + this.infoClient.port);
        this._is_alive = false;
        ParaSocket_1.ParaSocket.socketEventCenter.callEvent(EnumSocketEvent_1.EnumSocketEvent.client_disConnect, [this.infoClient.serverName, this.infoClient.id]);
        this.removeMe();
        this.clear();
        this.removeEvent();
        this.clearClientInfo();
        this.clearReceiver();
        this.clearSocketData();
    }
    clear() {
    }
    clearSocketData() {
        if (this.socketData) {
            this.socketData.dispose();
            this.socketData = null;
        }
    }
    clearClientInfo() {
        if (this.infoClient) {
            ParaSocket_1.ParaSocket.log('tcp离开: ' + this.infoClient.socket.remotePort + ":" + this.infoClient.socket.remoteAddress);
            this.removeEvent();
            this.infoClient.dispose();
            this.infoClient = null;
        }
    }
    clearReceiver() {
        if (this.receiver) {
            this.receiver.dispose();
            this.receiver = null;
        }
    }
    //====================================================================
    onClose() {
        if (this._is_alive == false)
            return;
        this.removeMe();
    }
    onEnd() {
        if (this._is_alive == false)
            return;
        this.removeMe();
    }
    onError() {
        if (this._is_alive == false)
            return;
        this.removeMe();
    }
    removeMe() {
        ParaSocket_1.ParaSocket.removeClientOnServer(this.infoClient.serverName, this.getid());
    }
    closeSocket() {
        try {
            this.infoClient.socket.end();
        }
        catch (e) {
        }
    }
    addEvent() {
        if (this.infoClient != null) {
            this.infoClient.socket.addListener('data', this.onmessage.bind(this));
            this.infoClient.socket.addListener('close', this.onClose.bind(this));
            this.infoClient.socket.addListener('end', this.onEnd.bind(this));
            this.infoClient.socket.addListener('error', this.onError.bind(this));
        }
    }
    removeEvent() {
        if (this.infoClient != null) {
            this.infoClient.socket.removeListener('data', this.onmessage.bind(this));
            this.infoClient.socket.removeListener('close', this.onClose.bind(this));
            this.infoClient.socket.removeListener('end', this.onEnd.bind(this));
            this.infoClient.socket.removeListener('error', this.onError.bind(this));
        }
    }
}
exports.ServerTCPClient = ServerTCPClient;
//# sourceMappingURL=ServerTCPClient.js.map