"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParaSocket_1 = require("../ParaSocket");
class LogParaSocket {
    log(msg) {
        if (ParaSocket_1.ParaSocket.showLog) {
            console.log("【para:" + ParaSocket_1.ParaSocket.version + "】【info】" + msg);
        }
    }
    onErr(msg) {
        console.log("【para" + ParaSocket_1.ParaSocket.version + "】【error】" + msg); //暂时没有做处理 todo
    }
}
exports.LogParaSocket = LogParaSocket;
//# sourceMappingURL=LogParaSocket.js.map