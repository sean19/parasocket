"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParaConfig_1 = require("./ParaConfig");
const SocketEventManager_1 = require("./socketEvent/SocketEventManager");
const ServerTcpManager_1 = require("./socketServer/ServerTcpManager");
const ClientTcpManager_1 = require("./socketClient/ClientTcpManager");
const LogParaSocket_1 = require("./core/LogParaSocket");
const SocketPackage_1 = require("./SocketPackage");
/**
 * 添加服务器
 * 1、注册gameServer的socketData
 * ParaSocket.registorServerSocketData(EnumServerName.game_server,GameServerSocketData);
 * 2、添加服务
 * ParaSocket.addServer( sInfo.sid, sInfo.name, socket_port );//添加服务
 *3、添加句柄
 * ParaSocket.registerHandler("gameServerCTR",EnumGameCMD.gameServerVersion, new GameVersionHandler());
 *
 *添加客户端
 * 1、同上
 * 2、ParaSocket.addClient(syncdata.sid,syncdata.name,syncdata.port,syncdata.ipaddress,);
 * 3、同上
 *
 *
 */
class ParaSocket {
    static log(msg) {
        this._log.log(msg);
    }
    static logerr(msg) {
        this._log.onErr(msg);
    }
    /**
     * 打印服务器上的人数
     * @param {string} serverName
     */
    static showClientsInserver(serverName) {
        ParaSocket.log("服务器【" + serverName + "】的连接人数：" + ParaSocket.tcpServerMgr.getAllClinets(serverName).size);
    }
    static registorServerSocketData(servername, socketData) {
        if (this.socketServerMap.get(servername) == null) {
            this.socketServerMap.set(servername, socketData);
        }
    }
    /**
     * 添加服务器
     * @param {number} serid
     * @param {string} serverName
     * @param {number} port
     */
    static addServer(serid, serverName, port) {
        var info = ParaSocket.config.addServerInfo(serid, serverName, port, "");
        ParaSocket.tcpServerMgr.addServer(info);
    }
    /**
     * 添加socket客户端
     * @param {number} serid
     * @param {string} serverName
     * @param {number} port
     * @param {string} ipaddress
     */
    static addClient(serid, serverName, port, ipaddress) {
        var info = ParaSocket.config.addServerInfo(serid, serverName, port, "", ipaddress, true);
        ParaSocket.tcpClientMgr.addClient(info);
    }
    /**
     * 根据名字获取客户端的socketData
     * @param {string} clientName
     * @returns {SocketData}
     */
    static getClientData(clientName) {
        var client = ParaSocket.tcpClientMgr.getClientByName(clientName);
        return client.socketData;
    }
    /**
     * 获取连接到服务器的客户端的socketData
     * @param {string} serverName
     * @param {number} socketid
     * @returns {SocketData}
     */
    static getServerClientData(serverName, socketid) {
        var client = ParaSocket.tcpServerMgr.getClient(serverName, socketid);
        return client.socketData;
    }
    /**
     * 客户端发送二进制数据到服务器
     * @param {string} clientName
     * @param {number} cmdid
     * @param {Buffer} bu
     */
    static sendmsg2Server(clientName, cmdid, buff) {
        var client = ParaSocket.tcpClientMgr.getClientByName(clientName);
        var pkg = new SocketPackage_1.SocketPackage(clientName, cmdid);
        pkg.putBytes(buff);
        client.sendPkg(pkg);
    }
    /**
     * 发送二进制数据到客户端
     * @param {string} serverName 服务器名字
     * @param {number} socketid 在服务器上的socketid
     * @param {number} cmdid 命令id
     * @param {Buffer} buff
     */
    static sendmsg2Client(serverName, socketid, cmdid, buff) {
        var client = ParaSocket.tcpServerMgr.getClient(serverName, socketid);
        var pkg = new SocketPackage_1.SocketPackage(serverName, cmdid);
        pkg.putBytes(buff);
        client.sendPkg(pkg);
    }
    /**
     * 添加消息的回调方法
     * @param {string} servername
     * @param {number} cmdID
     * @param {Function} callback
     */
    static addCallback(servername, cmdID, callback) {
        var infoMain = ParaSocket.config.getServerInfoByName(servername);
        infoMain.addCallback(cmdID, callback);
    }
    /**
     * 删除一个客户端
     * @param {string} clientName
     */
    static removeClient(clientName) {
        ParaSocket.tcpClientMgr.removeClient(clientName);
    }
    /**
     * 删除一个在服务器上的客户端
     * @param {string} serverName
     * @param {number} socketid
     */
    static removeClientOnServer(serverName, socketid) {
        ParaSocket.tcpServerMgr.getServerBySocketServerName(serverName).removeClient(socketid);
    }
}
ParaSocket.version = "1.0.5";
ParaSocket._log = new LogParaSocket_1.LogParaSocket();
ParaSocket.tcpServerMgr = new ServerTcpManager_1.ServerTcpManager();
ParaSocket.tcpClientMgr = new ClientTcpManager_1.ClientTcpManager();
ParaSocket.socketEventCenter = new SocketEventManager_1.SocketEventManager();
ParaSocket.config = new ParaConfig_1.ParaConfig();
ParaSocket.showLog = true;
// public static tcpClient:
ParaSocket.onen_connect = true;
ParaSocket.socketServerMap = new Map();
exports.ParaSocket = ParaSocket;
//# sourceMappingURL=ParaSocket.js.map