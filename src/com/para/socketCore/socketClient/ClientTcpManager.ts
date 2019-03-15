import {ClientTcp} from "./ClientTcp";
import {InfoClient} from "../info/InfoClient";
import {ParaSocket} from "../ParaSocket";

export class ClientTcpManager  {

    public socketClientMap:Map<String,ClientTcp>=new Map();

    public addClient(socketInfo: InfoClient): void {
        var client:ClientTcp = new ClientTcp(socketInfo);
        if(this.socketClientMap.get(socketInfo.serverName)){
            ParaSocket.logerr("client name "+socketInfo.serverName+" already exit ")
        }else{
            this.socketClientMap.set(socketInfo.serverName,client);
        }

    }
    public getClientByName(serverName:string): ClientTcp {
        return this.socketClientMap.get(serverName);
    }

    public getAllClinets():Map<String,ClientTcp>{
            return this.socketClientMap;
    }
    public removeClient(clinetName:string):void {
        var client:ClientTcp=this.socketClientMap.get(clinetName);
        if(client){
            client.dispose();
        }
        this.socketClientMap.delete(clinetName);
    }
}