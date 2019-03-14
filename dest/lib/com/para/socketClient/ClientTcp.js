"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParaSocket_1 = require("../ParaSocket");
const EnumSocketEvent_1 = require("../socketEvent/EnumSocketEvent");
const SocketMessageRecever_1 = require("../socketServer/SocketMessageRecever");
const net_1 = require("net");
const TcpClientBase_1 = require("../core/TcpClientBase");
class ClientTcp extends TcpClientBase_1.TcpClientBase {
    constructor(infoClient) {
        super(infoClient);
        this._is_alive = true;
        this.inputPkgList = [];
        this.handlling = false;
        this.receiver = new SocketMessageRecever_1.SocketMessageRecever(this.onReceivePkg.bind(this));
        this.start();
    }
    start() {
        console.log("开始客户端的连接模块:" + this.infoClient.ipAddress + ":" + this.infoClient.port);
        this.onStartConnect();
    }
    onStartConnect() {
        if (this._is_alive == false)
            return;
        this.infoClient.socket = new net_1.Socket();
        let self = this;
        this.addEvent();
        var connnectStr = this.infoClient.ipAddress + ":" + this.infoClient.port;
        this.infoClient.socket.connect(this.infoClient.port, this.infoClient.ipAddress, function () {
            self.onConnected(connnectStr);
        });
    }
    onConnected(connnectStr) {
        if (this._is_alive == false) {
            console.log('客户端连接' + connnectStr + '成功,但是这个已经被干掉了,当出现这个提示请检查代码！');
            return;
        }
        console.log('客户端连接' + connnectStr + '成功');
        ParaSocket_1.ParaSocket.socketEventCenter.callEvent(EnumSocketEvent_1.EnumSocketEvent.client_connected, [this.infoClient.serverName, connnectStr]);
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
            ParaSocket_1.ParaSocket._log.onErr("句柄解析错误:" + pkg.cmdType + ":" + (e.stack || e));
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
        ParaSocket_1.ParaSocket.removeClient(this.infoClient.serverName);
    }
    //====================================================================
    clear() {
        if (this._is_alive == false) {
            return;
        }
        this._is_alive = false;
        ParaSocket_1.ParaSocket.socketEventCenter.callEvent(EnumSocketEvent_1.EnumSocketEvent.client_disConnect, [this.infoClient.serverName, this.infoClient.id]);
        this.removeMe();
        this.removeEvent();
        this.clearClientInfo();
        this.clearReceiver();
        this.clearSocketData();
    }
    clearSocketData() {
        if (this.socketData) {
            this.socketData.dispose();
            this.socketData = null;
        }
    }
    /**
     * 清理数据处理器
     */
    clearReceiver() {
        if (this.receiver) {
            this.receiver.dispose();
            this.receiver = null;
        }
    }
    /**
     * 清理clientInfo
     */
    clearClientInfo() {
        if (this.infoClient) {
            this.removeEvent();
            this.infoClient.dispose();
            this.infoClient = null;
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
exports.ClientTcp = ClientTcp;
//# sourceMappingURL=ClientTcp.js.map