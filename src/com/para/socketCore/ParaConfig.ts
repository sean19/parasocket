import {ParaSocket} from "./ParaSocket";
import {InfoServer} from "./info/InfoServer";
import {InfoBase} from "./info/InfoBase";
import {Socket} from "net";
import {InfoClient} from "./info/InfoClient";

export class ParaConfig
{
    public arrInfoServer:InfoBase[]= [];
    public ipv4:string="";
    public is_get_ip:boolean = false;

    public addServerInfo(sid:number,serverName:string,port:number,path:string,ipadress:string="0",isclient:boolean = false):InfoBase
    {
        var sv:InfoBase;
        if(isclient){
            sv = new InfoClient(sid,serverName,ipadress,port);
        }else{
            sv = new InfoServer(sid,serverName,port,path,ipadress);
        }
        this.arrInfoServer.push(sv);
        return sv;
    }

    public getServerInfoByName(serverName:string):InfoBase{
        for(var i:number=0;i<this.arrInfoServer.length;i++)
        {
            var server:InfoBase = this.arrInfoServer[i];
            if(server.serverName==serverName)
            {
                return server;
            }
        }
        return <any>null;
    }
    public TryStart(fc:Function):void
    {
        // console.log('this.ipv4='+this.ipv4)
        if(this.ipv4!="")
        {
            fc.apply(null);
        }else
        {
            this.TryGetIpv4(fc);
        }

    }
    public TryGetIpv4(fc:Function):void
    {
        var os=require('os');
        var ifaces=os.networkInterfaces();
        for (var dev in ifaces) {
            var alias=0;
            ifaces[dev].forEach(function(details:any){
                if (details.family=='IPv4') {

                    ++alias;
                    var adsStr:string = details.address;
                    if(ParaSocket.config.is_get_ip == false && adsStr.substr(0,3)!="127"&& adsStr.substr(0,2)!="10")
                    {
                        console.log(dev+(alias?':'+alias:''),details.address);
                        ParaSocket.config.ipv4 = adsStr;
                        // ParaSocket.config.ipv4 = "127.0.0.1";
                        ParaSocket.config.is_get_ip = true;
                        fc.apply(null);
                        // Reflect.apply(fc,thisArgument,[]);
                    }
                }
            });
        }
    }

}

