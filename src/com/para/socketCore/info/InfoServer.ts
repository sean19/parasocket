import {InfoHandler} from "./InfoHandler";
import {InfoBase} from "./InfoBase";
import {EnumServerType} from "../ParaSocket";

export class InfoServer extends InfoBase
{
    public id:number = 0;
    public server_type:EnumServerType =EnumServerType.local_server;
    public path:string="";
    public port:number = 0;
    public ipAdress:string="0";
    public constructor(id:number,servertype:EnumServerType,serverName:string,port:number,path:string,ipAdress:string="0")
    {
        super();
        this.server_type = servertype;
        this.ipAdress=ipAdress;
        this.serverName=serverName;
        this.port=port;
        this.id=id;
        this.path=path;
    }




}

