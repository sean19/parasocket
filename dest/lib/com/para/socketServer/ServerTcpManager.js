"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerTcp_1 = require("./ServerTcp");
class ServerTcpManager {
    constructor() {
        this.socketServerMap = new Map();
    }
    addServer(socketInfo) {
        var server = new ServerTcp_1.ServerTcp(socketInfo);
        this.socketServerMap.set(socketInfo.serverName, server);
    }
    getServerBySocketServerName(serverName) {
        return this.socketServerMap.get(serverName);
    }
    getClientByClientID(serverName, clientID) {
        var server = this.getServerBySocketServerName(serverName);
        return null;
    }
    getClient(serverName, socketID) {
        var server = this.getServerBySocketServerName(serverName);
        if (server != null) {
            let client = server.getClient(socketID);
            if (client && (client.getisactive() == true) && client.getid() == socketID) {
                return client;
            }
        }
        return null;
    }
    getAllClinets(serverName) {
        var server = this.getServerBySocketServerName(serverName);
        if (server != null) {
            return server.clientMap;
        }
    }
}
exports.ServerTcpManager = ServerTcpManager;
//# sourceMappingURL=ServerTcpManager.js.map