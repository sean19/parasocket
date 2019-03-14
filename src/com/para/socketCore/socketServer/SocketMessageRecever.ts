import { SocketPackage } from "../SocketPackage";

export class SocketMessageRecever {
    public constructor(dafc:Function)
    {
        this.data_handler=dafc;
    }
    protected receiveDate:Uint8Array;
    protected data_handler:Function;
    public dispose():void{
        this.data_handler=null;
        this.clear();
    }
    protected clear():void
    {

    }
    //======================
    public receiveData(servername:string,u8a:Uint8Array):void
    {
        this.addReceiveDate(u8a);

        var u8a2:Uint8Array = this.receiveDate;
        while(u8a2.length>=10){
            var pkg:SocketPackage = new SocketPackage(servername,-1);
            u8a2 = pkg.readBuffer(u8a2)
            if(pkg.can_send){
                this.receiveDate=u8a2;
                this.sendpkg(pkg);
            }else{
                return;
            }
        }
    }
    protected addReceiveDate(u8a:Uint8Array):void
    {
        if(this.receiveDate==null)
        {
            this.receiveDate = u8a;
        }else{
            if(u8a.length>0)
            {
                var newuarr:Uint8Array = new Uint8Array(this.receiveDate.length+u8a.length);
                newuarr.set(this.receiveDate,0);
                newuarr.set(u8a,this.receiveDate.length);
                this.receiveDate = newuarr;
            }
        }
    }
    protected sendpkg(pkg:SocketPackage):void
    {
        if(this.data_handler)
        {
            this.data_handler.apply(null,[pkg]);

        }
    }
}