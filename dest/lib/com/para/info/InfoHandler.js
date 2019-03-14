"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfoHandler {
    constructor(serverName, cmdID, callback) {
        this.serverName = "";
        this.cmdID = 0;
        this.handlers = [];
        this.serverName = serverName;
        this.cmdID = cmdID;
        this.callback = callback;
    }
}
exports.InfoHandler = InfoHandler;
//# sourceMappingURL=InfoHandler.js.map