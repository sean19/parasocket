"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerTCPClient_1 = require("./ServerTCPClient");
const ParaSocket_1 = require("../ParaSocket");
const InfoClient_1 = require("../info/InfoClient");
const EnumSocketEvent_1 = require("../socketEvent/EnumSocketEvent");
class ServerTcp {
    constructor(serverinfo) {
        this.client_id = 0;
        this.server_start = false;
        this.clientMap = new Map();
        this.serverinfo = serverinfo;
        this.start();
    }
    getid() {
        return this.serverinfo.id;
    }
    start() {
        ParaSocket_1.ParaSocket.config.TryStart(this.onGetIpv4Start.bind(this));
    }
    onGetIpv4Start() {
        var server_net = require('net');
        this.server = server_net.createServer(this.onConnect.bind(this));
        this.addEvent();
    }
    addEvent() {
        if (this.server_start == true)
            return;
        this.server_start = true;
        this.server.listen(this.serverinfo.port, ParaSocket_1.ParaSocket.config.ipv4);
        ParaSocket_1.ParaSocket.log("服务器--tcp开始侦听:" + ParaSocket_1.ParaSocket.config.ipv4 + ":" + this.serverinfo.port);
    }
    removeEvent() {
        if (this.server_start == false)
            return;
        ParaSocket_1.ParaSocket.log('服务器--tcp 停止侦听: ' + ParaSocket_1.ParaSocket.config.ipv4 + ":" + this.serverinfo.port);
    }
    onConnect(sock) {
        if (ParaSocket_1.ParaSocket.onen_connect == false) {
            ParaSocket_1.ParaSocket.log("【错误】+收到连接:" + sock.remoteAddress + ":" + sock.remotePort + "但是服务器没打开");
            sock.end();
            sock.destroy();
            sock = null;
            return;
        }
        if (this.server_start == false) {
            ParaSocket_1.ParaSocket._log.log("TcpSocketServer 服务还没启动 =====");
            return;
        }
        this.client_id++;
        console.log("服务端：" + ParaSocket_1.ParaSocket.config.ipv4 + ":" + this.serverinfo.port + "——收到连接:" + sock.remoteAddress + ":" + sock.remotePort);
        ParaSocket_1.ParaSocket.socketEventCenter.callEvent(EnumSocketEvent_1.EnumSocketEvent.server_receive_connected, [this.serverinfo.serverName, this.client_id]);
        var infoClient = new InfoClient_1.InfoClient(this.client_id, this.serverinfo.serverName, sock.remoteAddress, sock.remotePort, sock);
        var client = new ServerTCPClient_1.ServerTCPClient(infoClient);
        this.clientMap.set(this.client_id, client);
    }
    removeClient(id) {
        var client = this.clientMap.get(id);
        if (client) {
            client.dispose();
        }
        this.clientMap.delete(id);
    }
    getClient(id) {
        return this.clientMap.get(id);
    }
    getClientByClientID(clientID) {
        this.clientMap.forEach(cl => {
            if (cl.infoClient.client_id == clientID) {
                return cl;
            }
        });
        return null;
    }
    clear() {
        this.removeEvent();
        if (this.server) {
            this.server.close();
            this.server = null;
        }
        this.server_start = false;
        this.serverinfo = null;
    }
    dispose() {
    }
}
exports.ServerTcp = ServerTcp;
//# sourceMappingURL=ServerTcp.js.map