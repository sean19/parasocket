"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InfoBase_1 = require("./InfoBase");
class InfoServer extends InfoBase_1.InfoBase {
    constructor(id, serverName, port, path, ipAdress = "0") {
        super();
        this.id = 0;
        this.path = "";
        this.port = 0;
        this.ipAdress = "0";
        this.ipAdress = ipAdress;
        this.serverName = serverName;
        this.port = port;
        this.id = id;
        this.path = path;
    }
}
exports.InfoServer = InfoServer;
//# sourceMappingURL=InfoServer.js.map