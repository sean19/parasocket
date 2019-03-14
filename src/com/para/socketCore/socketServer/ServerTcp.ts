import {Server, Socket} from "net";
import {ServerTCPClient} from "./ServerTCPClient";
import {IItem} from "../core/IItem";
import {InfoServer} from "../info/InfoServer";
import {ParaSocket} from "../ParaSocket";
import {InfoClient} from "../info/InfoClient";
import {EnumSocketEvent} from "../socketEvent/EnumSocketEvent";

export class ServerTcp implements IItem
{
    private serverinfo:InfoServer;
    protected client_id:number = 0;
    protected server_start:boolean =false;
    protected server:Server;
    public clientMap:Map<number,ServerTCPClient>=new Map();

    public constructor( serverinfo: InfoServer )
    {
        this. serverinfo = serverinfo;
        this.start();

    }
    public getid():number{
        return this.serverinfo.id;
    }

    public start()
    {
        ParaSocket.config.TryStart(this.onGetIpv4Start.bind(this));
    }
    protected onGetIpv4Start():void
    {
        var server_net = require('net');
        this.server = server_net.createServer(this.onConnect.bind(this));
        this.addEvent();

    }

    protected addEvent():void
    {
        if(this.server_start==true)return;
        this.server_start =true;
        this.server.listen(this.serverinfo.port, ParaSocket.config.ipv4);
        ParaSocket.log("服务器--tcp开始侦听:"+ParaSocket.config.ipv4+":"+this.serverinfo.port);

    }
    protected removeEvent():void
    {
        if(this.server_start==false)return;
        ParaSocket.log('服务器--tcp 停止侦听: '+ParaSocket.config.ipv4+":"+this.serverinfo.port);
    }
    protected onConnect(sock:Socket):void
    {
        if(ParaSocket.onen_connect == false){
            ParaSocket.log("【错误】+收到连接:"+sock.remoteAddress+":"+sock.remotePort+"但是服务器没打开");
            sock.end();
            sock.destroy();
            sock=null;
            return;
        }
        if(this.server_start==false){
            ParaSocket._log.log("TcpSocketServer 服务还没启动 =====");
            return;
        }

        this.client_id++;
        console.log("服务端："+ParaSocket.config.ipv4+":"+this.serverinfo.port+"——收到连接:"+sock.remoteAddress+":"+sock.remotePort);
        ParaSocket.socketEventCenter.callEvent(EnumSocketEvent.server_receive_connected, [this.serverinfo.serverName,this.client_id]);
        var infoClient:InfoClient = new InfoClient(this.client_id,this.serverinfo.serverName,sock.remoteAddress,sock.remotePort,sock);
        var client:ServerTCPClient  = new ServerTCPClient(infoClient);
        this.clientMap.set(this.client_id,client);
    }

    public removeClient(id:number):void {
        var client:ServerTCPClient=this.clientMap.get(id);
        if(client){
            client.dispose();
        }
        this.clientMap.delete(id);
    }

    public getClient(id:number):ServerTCPClient{
        return this.clientMap.get(id);
    }
    public getClientByClientID(clientID:number):ServerTCPClient{
        this.clientMap.forEach(cl=>{
            if(cl.infoClient.client_id == clientID){
                return cl;
            }
        })
        return <any>null;
    }

    protected clear():void
    {
        this.removeEvent();
        if(this.server)
        {
            this.server.close();
            this.server = <any>null;
        }
        this.server_start = false;
        this.serverinfo=<any>null;
    }

    dispose(): void {


    }

}