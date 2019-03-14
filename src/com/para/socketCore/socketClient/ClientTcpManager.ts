import {ClientTcp} from "./ClientTcp";
import {InfoClient} from "../info/InfoClient";

export class ClientTcpManager  {

    public socketClientMap:Map<String,ClientTcp>=new Map();

    public addClient(socketInfo: InfoClient): void {
        var client:ClientTcp = new ClientTcp(socketInfo);
        this.socketClientMap.set(socketInfo.serverName,client);
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