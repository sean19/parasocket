import {ServerTcp} from "./ServerTcp";
import {ServerTCPClient} from "./ServerTCPClient";
import {InfoServer} from "../info/InfoServer";

export class ServerTcpManager  {

    public socketServerMap:Map<String,ServerTcp>=new Map();

    public addServer(socketInfo: InfoServer): void {
        var server:ServerTcp = new ServerTcp(socketInfo);
        this.socketServerMap.set(socketInfo.serverName,server);
    }
    public getServerBySocketServerName(serverName:string): ServerTcp {
        return this.socketServerMap.get(serverName);
    }
    public getClientByClientID(serverName:string,clientID:number):ServerTCPClient{
        var server:ServerTcp = this.getServerBySocketServerName(serverName);
        return <any>null;
    }
    public getClient(serverName:string,socketID:number):ServerTCPClient
    {
        var server:ServerTcp = this.getServerBySocketServerName(serverName);
        if(server != null)
        {
            let client:ServerTCPClient=server.getClient(socketID);
            if(client && (client.getisactive() == true) && client.getid() == socketID)
            {
                return client;
            }
        }
        return <any>null;
    }

    public getAllClinets(serverName:string):Map<number,ServerTCPClient>{
        var server:ServerTcp = this.getServerBySocketServerName(serverName);
        if(server != null)
        {
            return server.clientMap;
        }
    }


}