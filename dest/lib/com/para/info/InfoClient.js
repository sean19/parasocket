"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InfoBase_1 = require("./InfoBase");
class InfoClient extends InfoBase_1.InfoBase {
    /**
     *
     * @param id
     * @param serverName
     * @param socket
     * @param ipAddress
     * @param port 当端口号为-1的时候，那么代表是外面传过来的socket,直接在socket上获取ip和端口号
     */
    constructor(id, serverName, ipAddress = "", port = -1, socket = null) {
        super();
        this.id = -1;
        this.client_id = -1;
        this.ipAddress = "";
        this.serverName = serverName;
        this.id = id;
        if (socket != null) {
            this.socket = socket;
            this.ipAddress = socket.remoteAddress;
            this.port = socket.remotePort;
        }
        else {
            this.ipAddress = ipAddress;
            this.port = port;
        }
    }
    dispose() {
        try {
            this.socket.end();
            this.socket.destroy();
        }
        catch (e) {
        }
        this.socket = null;
    }
}
exports.InfoClient = InfoClient;
//# sourceMappingURL=InfoClient.js.map