"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParaSocket_1 = require("../ParaSocket");
class TcpClientBase {
    constructor(infoClient) {
        this.infoClient = infoClient;
        var skf = ParaSocket_1.ParaSocket.socketServerMap.get(infoClient.serverName);
        if (skf == null) {
            ParaSocket_1.ParaSocket._log.onErr("没有注册：" + infoClient.serverName + "处理数据类socketData");
            return;
        }
        this.socketData = Reflect.construct(skf, [infoClient.serverName, infoClient.id]);
    }
    /**
     * 处理数据包
     * @param pkg
     */
    async handlerPkg(pkg) {
        var cmdType = pkg.cmdType;
        var socketID = this.infoClient.id;
        var serverName = this.infoClient.serverName;
        var serverinfo = ParaSocket_1.ParaSocket.config.getServerInfoByName(serverName);
        if (!serverinfo) {
            ParaSocket_1.ParaSocket.log("serverinfo_Is_Null serverName:" + serverName + ",socketID:" + socketID + ",cmdType:" + cmdType);
            return;
        }
        var handlerInfo = serverinfo.getInfoHandler(cmdType);
        if (!handlerInfo) {
            ParaSocket_1.ParaSocket._log.onErr("handlerInfoIsNull clientTcpclient_serverName:" + serverName + ",socketID:" + socketID + ",cmdType:" + cmdType);
            return;
        }
        var handlerBase = handlerInfo.callback;
        if (handlerBase != null) {
            await handlerBase.call(null, serverName, socketID, cmdType, pkg);
        }
    }
    getid() {
        return -1000;
    }
    sendPkg(pkg) {
    }
    dispose() {
        this.clear();
        this.socketData = null;
    }
    clear() {
    }
}
exports.TcpClientBase = TcpClientBase;
//# sourceMappingURL=TcpClientBase.js.map