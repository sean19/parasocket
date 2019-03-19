import {ParaSocket} from "../ParaSocket";

export class LogParaSocket {
    public log(msg:string):void{
        if(ParaSocket.showLog){
            console.log("【para:"+ParaSocket.version+"】【info】"+msg);
        }
    }
    public onErr(msg:string):void{
        if(ParaSocket.showLog)
        console.log("【para"+ParaSocket.version+"】【error】"+msg);//暂时没有做处理 todo
    }
}