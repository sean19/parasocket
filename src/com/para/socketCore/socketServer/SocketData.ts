import {IItem} from "../core/IItem";
import {ParaSocket} from "../ParaSocket";

export class SocketData implements IItem{
    protected _socket_id:number = 0;
    public socketName:string;
    public get socketID(){
        return this._socket_id;
    }
    public set socketID(idd:number)
    {
        ParaSocket._log.log("错误赋值--!!!!!!!紧急通知||||||||||||||||||||||||");
    }
    constructor(socketname:string,socketID:number)
    {
        this._socket_id = socketID;
        this.socketName=socketname;
    }

    public  getid():number
    {
        return this.socketID;
    }
    public dispose():void
    {
        this.clear();
    }
    protected clear():void
    {

    }

}