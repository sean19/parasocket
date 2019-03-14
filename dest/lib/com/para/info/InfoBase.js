"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InfoHandler_1 = require("./InfoHandler");
class InfoBase {
    constructor() {
        this.serverName = "";
        this.handlerMap = new Map();
    }
    addCallback(cmdID, callback) {
        if (this.getInfoHandler(cmdID) != null)
            return;
        var infoH = new InfoHandler_1.InfoHandler(this.serverName, cmdID, callback);
        this.handlerMap.set(cmdID, infoH);
    }
    getInfoHandler(cmdid) {
        return this.handlerMap.get(cmdid);
    }
}
exports.InfoBase = InfoBase;
//# sourceMappingURL=InfoBase.js.map