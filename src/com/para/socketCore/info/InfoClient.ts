import {Socket} from "net";
import {InfoBase} from "./InfoBase";

export class InfoClient extends InfoBase
{
    public id:number = -1;
    public client_id:number = -1;

    public ipAddress:string="";

    public socket:Socket;
    public port:number;




    /**
     *
     * @param id
     * @param serverName
     * @param socket
     * @param ipAddress
     * @param port 当端口号为-1的时候，那么代表是外面传过来的socket,直接在socket上获取ip和端口号
     */

    public constructor(id:number,serverName:string,ipAddress:string="",port:number=-1,socket:Socket=null)
    {
        super();
        this.serverName=serverName;
        this.id=id;
        if(socket != null){
            this.socket=socket;
            this.ipAddress=socket.remoteAddress;
            this.port=socket.remotePort;
        }else{
            this.ipAddress = ipAddress;
            this.port=port;
        }
    }
    public dispose()
    {
        try{
            this.socket.end();
            this.socket.destroy();
        }catch (e) {

        }
        this.socket = <any>null;

    }



}

