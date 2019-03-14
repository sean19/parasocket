import {EventInfo} from "./EventInfo";
import {EnumSocketEvent} from "./EnumSocketEvent";

export class SocketEventManager
{
    protected arr_info:EventInfo[] = [];
    public addCallBack(evt:EnumSocketEvent,fc:Function):void
    {
        if(this.getEvent(evt,fc)!=null)return;
        this.arr_info.push(new EventInfo(evt,fc));
    }
    public removeCallBack(evt:EnumSocketEvent,fc:Function):void
    {
        for(var i:number=0;i<this.arr_info.length;i++)
        {
            var info:EventInfo = this.arr_info[i];
            if(info.evt==evt&&info.fc==fc)
            {
                info.dispose();
                this.arr_info.splice(i,1);
                return;
            }
        }
    }
    public callEvent(evt:EnumSocketEvent,param:any[]):void
    {
        for(var i:number=0;i<this.arr_info.length;i++)
        {
            var info:EventInfo = this.arr_info[i];
            if(info.evt==evt)
            {
                info.callfc(param);
            }
        }
    }
    protected getEvent(evt:EnumSocketEvent,fc:Function):EventInfo
    {
        for(var i:number=0;i<this.arr_info.length;i++)
        {
            var info:EventInfo = this.arr_info[i];
            if(info.evt==evt&&info.fc==fc)
            {
                return info;
            }
        }
        return null;
    }
}