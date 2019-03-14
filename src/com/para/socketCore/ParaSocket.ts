import {ParaConfig} from "./ParaConfig";
import {InfoServer} from "./info/InfoServer";
import {SocketEventManager} from "./socketEvent/SocketEventManager";
import {ServerTcpManager} from "./socketServer/ServerTcpManager";
import {InfoClient} from "./info/InfoClient";
import {ClientTcpManager} from "./socketClient/ClientTcpManager";
import {InfoBase} from "./info/InfoBase";
import {LogParaSocket} from "./core/LogParaSocket";
import {Socket} from "net";
import {ClientTcp} from "./socketClient/ClientTcp";
import {SocketPackage} from "./SocketPackage";
import {ServerTCPClient} from "./socketServer/ServerTCPClient";
import {SocketData} from "./socketServer/SocketData";

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

export class ParaSocket
{

    public static version:string="1.0.5";
    public static _log:LogParaSocket = new LogParaSocket();
    private static tcpServerMgr:ServerTcpManager = new ServerTcpManager();
    private static tcpClientMgr:ClientTcpManager = new ClientTcpManager();

    public static socketEventCenter:SocketEventManager = new SocketEventManager();
    public static config:ParaConfig = new ParaConfig();

    public static showLog:boolean=true;
    // public static tcpClient:
    public static onen_connect:boolean = true;

    public static socketServerMap:Map<String,Function>=new Map();
    public static log(msg:string):void{
        this._log.log(msg);
    }
    public static logerr(msg:string):void{
        this._log.onErr(msg);
    }

    /**
     * 打印服务器上的人数
     * @param {string} serverName
     */
    public static showClientsInserver(serverName:string):void{
        ParaSocket.log("服务器【"+serverName+"】的连接人数："+ParaSocket.tcpServerMgr.getAllClinets(serverName).size);
    }
    public static registorServerSocketData(servername:string,socketData:Function):void{
        if(this.socketServerMap.get(servername)==null){
            this.socketServerMap.set(servername,socketData);
        }
    }

    /**
     * 添加服务器
     * @param {number} serid
     * @param {string} serverName
     * @param {number} port
     */
    public static addServer(serid:number,serverName:string,port:number):void
    {
       var info:InfoServer =  <InfoServer>ParaSocket.config.addServerInfo(serid,serverName,port,"");
        ParaSocket.tcpServerMgr.addServer(info);
    }

    /**
     * 添加socket客户端
     * @param {number} serid
     * @param {string} serverName
     * @param {number} port
     * @param {string} ipaddress
     */
    public static addClient(serid:number,serverName:string,port:number,ipaddress:string ):void
    {
        var info:InfoClient =  <InfoClient>ParaSocket.config.addServerInfo(serid,serverName,port,"",ipaddress,true);
        ParaSocket.tcpClientMgr.addClient(info);
    }

    /**
     * 根据名字获取客户端的socketData
     * @param {string} clientName
     * @returns {SocketData}
     */
    public static getClientData(clientName:string):SocketData{
        var client:ClientTcp = ParaSocket.tcpClientMgr.getClientByName(clientName);
        return client.socketData;
    }

    /**
     * 获取连接到服务器的客户端的socketData
     * @param {string} serverName
     * @param {number} socketid
     * @returns {SocketData}
     */
    public static getServerClientData(serverName:string,socketid:number):SocketData{
        var client:ServerTCPClient = ParaSocket.tcpServerMgr.getClient(serverName,socketid);
        return client.socketData;
    }
    /**
     * 客户端发送二进制数据到服务器
     * @param {string} clientName
     * @param {number} cmdid
     * @param {Buffer} bu
     */
    public static sendmsg2Server(clientName:string,cmdid:number,buff:Buffer):void{
        var client:ClientTcp = ParaSocket.tcpClientMgr.getClientByName(clientName);
        var pkg:SocketPackage = new SocketPackage(clientName,cmdid);
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
    public static sendmsg2Client(serverName:string,socketid:number,cmdid:number,buff:Buffer):void{
        var client:ServerTCPClient = ParaSocket.tcpServerMgr.getClient(serverName,socketid);
        var pkg:SocketPackage = new SocketPackage(serverName,cmdid);
        pkg.putBytes(buff);
        client.sendPkg(pkg);
    }

    /**
     * 添加消息的回调方法
     * @param {string} servername
     * @param {number} cmdID
     * @param {Function} callback
     */
    public static addCallback(servername:string,cmdID:number,callback:(name:string,socketid:number,cmdid:number, buffer:Buffer) => void):void
    {
        var infoMain:InfoBase = ParaSocket.config.getServerInfoByName(servername);
        infoMain.addCallback(cmdID,callback);
    }

    /**
     * 删除一个客户端
     * @param {string} clientName
     */
    public static removeClient(clientName:string):void{
        ParaSocket.tcpClientMgr.removeClient(clientName);
    }
    /**
     * 删除一个在服务器上的客户端
     * @param {string} serverName
     * @param {number} socketid
     */
    public static removeClientOnServer(serverName:string,socketid:number): void {
        ParaSocket.tcpServerMgr.getServerBySocketServerName(serverName).removeClient(socketid);
    }


}

