import {InfoHandler} from "./InfoHandler";
import {InfoBase} from "./InfoBase";

export class InfoServer extends InfoBase
{
    public id:number = 0;
    public path:string="";
    public port:number = 0;
    public ipAdress:string="0";
    public constructor(id:number,serverName:string,port:number,path:string,ipAdress:string="0")
    {
        super();
        this.ipAdress=ipAdress;
        this.serverName=serverName;
        this.port=port;
        this.id=id;
        this.path=path;
    }




}

