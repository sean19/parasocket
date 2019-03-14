import {InfoHandler} from "./InfoHandler";

export class InfoBase {
    public serverName:string="";
    protected handlerMap:Map<number,InfoHandler> = new Map();
    public addCallback(cmdID:number,callback:(name:string,socketid:number,cmdid:number,buffer:Buffer)=>void):void
    {
        if(this.getInfoHandler(cmdID)!=null)return;
        var infoH:InfoHandler = new InfoHandler(this.serverName,cmdID,callback);
        this.handlerMap.set(cmdID,infoH);
    }
    public getInfoHandler(cmdid:number):InfoHandler
    {
        return this.handlerMap.get(cmdid);
    }
}