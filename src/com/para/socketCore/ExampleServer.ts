import {EnumServerType, EnumSocketEvent, ParaSocket, SocketData} from "./ParaSocket";


export class ExampleServer {
    constructor(){
        this.init();
    }
    public async init(){
        ParaSocket.showLog=true;
        ParaSocket.registorServerSocketData('server1',DemoSocketData);
        ParaSocket.addServer(0,'server1',8082,EnumServerType.ipv4_server);
        ParaSocket.addCmmandCallback('server1',1,this.oncmd1.bind(this));
        ParaSocket.addEventCallBack(EnumSocketEvent.server_client_connected,this.onclientconnected.bind(this));
        ParaSocket.addEventCallBack(EnumSocketEvent.client_disConnect,this.onclientDisconnected.bind(this));
    }

    protected oncmd1(name,sockid,cmdid,buffer):void{
        console.log(buffer[0])
    }
    protected onclientconnected(serverName:string,clientid:number):void{
        console.log(serverName);
    }
    protected onclientDisconnected(serverName:string,clientid:number):void{
        console.log(serverName);
    }
}


export class DemoSocketData extends SocketData{
    constructor(socketname:string,socketID:number){
        super(socketname,socketID);
    }
}