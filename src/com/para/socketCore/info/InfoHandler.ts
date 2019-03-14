
export class InfoHandler
{
    public serverName:string="";
    public cmdID:number = 0;
    public callback:Function;
    public constructor(serverName:string,cmdID:number,callback:(name:string,socketid:number,cmdid:number,buffer:Buffer)=>void)
    {
        this.serverName=serverName;
        this.cmdID=cmdID;
        this.callback=callback;
    }
    public handlers:string[] = [];

}