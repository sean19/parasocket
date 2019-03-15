import {IItem} from "./IItem";
import {InfoClient} from "../info/InfoClient";
import {SocketPackage} from "../SocketPackage";
import {ParaSocket, SocketData} from "../ParaSocket";
import {InfoBase} from "../info/InfoBase";

export class TcpClientBase implements IItem {
    public socketData: SocketData;
    public infoClient:InfoClient;
    constructor(infoClient: InfoClient){
        this.infoClient=infoClient;
        var skf:Function = ParaSocket.socketServerMap.get(infoClient.serverName);
        if(skf==null){
            ParaSocket._log.onErr("没有注册："+infoClient.serverName+"处理数据类socketData");
            return;
        }
        this.socketData =Reflect.construct(skf, [infoClient.serverName, infoClient.id]);
    }
    /**
     * 处理数据包
     * @param pkg
     */
    protected async handlerPkg(pkg: SocketPackage) {
        var cmdType = pkg.cmdType;
        var socketID = this.infoClient.id;
        var serverName = this.infoClient.serverName;


        var serverinfo: InfoBase = ParaSocket.config.getServerInfoByName(serverName);
        if (!serverinfo) {
            ParaSocket.log("serverinfo_Is_Null serverName:" + serverName + ",socketID:" + socketID + ",cmdType:" + cmdType);
            return;
        }
        var handlerInfo = serverinfo.getInfoHandler(cmdType);
        if (!handlerInfo) {
            ParaSocket._log.onErr("handlerInfoIsNull clientTcpclient_serverName:" + serverName + ",socketID:" + socketID + ",cmdType:" + cmdType);
            return;
        }
        var handlerBase: Function = handlerInfo.callback;
        if (handlerBase != null) {
            await  handlerBase.call(null,serverName, socketID, cmdType, pkg);
        }
    }
    public getid(): number {
        return -1000;
    }
    public sendPkg(pkg:SocketPackage):void{

    }
    public dispose():void{
        this.clear();
        this.socketData = null;
    }
    protected clear():void{

    }
}