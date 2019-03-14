import {EnumSocketEvent} from "./EnumSocketEvent";

export class EventInfo{
    public evt:EnumSocketEvent;
    public fc:Function;
    public constructor (evt:EnumSocketEvent,fc:Function){
        this.evt=evt;
        this.fc=fc;
    }
    public  callfc(param:any[]):void
     {
         this.fc.apply(null,param);
     }public dispose():void
    {
        this.fc=null;

    }


}