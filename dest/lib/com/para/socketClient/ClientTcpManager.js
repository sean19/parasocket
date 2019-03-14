"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientTcp_1 = require("./ClientTcp");
class ClientTcpManager {
    constructor() {
        this.socketClientMap = new Map();
    }
    addClient(socketInfo) {
        var client = new ClientTcp_1.ClientTcp(socketInfo);
        this.socketClientMap.set(socketInfo.serverName, client);
    }
    getClientByName(serverName) {
        return this.socketClientMap.get(serverName);
    }
    getAllClinets() {
        return this.socketClientMap;
    }
    removeClient(clinetName) {
        var client = this.socketClientMap.get(clinetName);
        if (client) {
            client.dispose();
        }
        this.socketClientMap.delete(clinetName);
    }
}
exports.ClientTcpManager = ClientTcpManager;
//# sourceMappingURL=ClientTcpManager.js.map