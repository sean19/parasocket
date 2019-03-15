import {EnumServerType, ParaSocket} from "./ParaSocket";
import {InfoServer} from "./info/InfoServer";
import {InfoBase} from "./info/InfoBase";
import {Socket} from "net";
import {InfoClient} from "./info/InfoClient";

export class ParaConfig
{
    public arrInfoServer:InfoBase[]= [];
    public iplocal:string="127.0.0.1";
    public ipv4:string="";
    public ipv6:string="";

    public is_get_ip:boolean = false;

    public initIpaddress():void{
        if(ParaSocket.config.is_get_ip == true)
        {
            ParaSocket.logerr("config has been init no need to be do this again");
        }
        var os=require('os');
        var ifaces=os.networkInterfaces();
        for (var dev in ifaces) {
            ifaces[dev].forEach(function(details:any){
                var adsStr:string = details.address;
                if (details.family=='IPv4') {
                    if(ParaSocket.config.is_get_ip == false && adsStr.substr(0,3)!="127"&& adsStr.substr(0,2)!="10")
                    {
                        ParaSocket.config.ipv4 = adsStr;
                    }
                }else if (details.family=="IPv6") {
                    ParaSocket.config.ipv6 = adsStr;
                }
            });
        }
        ParaSocket.log("config has been init ok!");
        ParaSocket.log("ipv4："+ParaSocket.config.ipv4);
        ParaSocket.log("ipv6："+ParaSocket.config.ipv6);

        ParaSocket.config.is_get_ip = true;
    }
    public addServerInfo(sid:number,serverName:string,port:number,path:string,ipadress:string="0",isclient:boolean = false,servertype:EnumServerType = EnumServerType.local_server):InfoBase
    {
        var sv:InfoBase;
        if(isclient){
            sv = new InfoClient(sid,serverName,ipadress,port);
        }else{
            sv = new InfoServer(sid,servertype,serverName,port,path,ipadress,);
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



}

