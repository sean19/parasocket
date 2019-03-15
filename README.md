# parasocket
a tcp socket server and client application
1.0.6 add ParaSocket.d.ts

/example code***********************************************************
ParaSocket.showLog =true;//open para log
let myip:string = "192.168.3.52";//set myip
//register socketdata
ParaSocket.registorServerSocketData("user",ServerData);
ParaSocket.addServer(0,"user",8081,EnumServerType.ipv4_server);
ParaSocket.addClient(-1,"uu",8081,myip);

ParaSocket.addCallback('user',1,(name:string,socketid:number,cmdid:number,buff:Buffer)=>{
    console.log("SERVER:::::"+name+":socketid="+socketid+":CMDID:"+cmdid);
    ParaSocket.sendmsg2Client(name,socketid,2,Buffer.alloc(3));
});
ParaSocket.addCallback('uu',2,(name:string,socketid:number,cmdid:number,buff:Buffer)=>{
    console.log("CLIENT:::::"+name+":socketid="+socketid+":CMDID:"+cmdid);
})

ParaSocket.sendmsg2Server('uu',1,Buffer.alloc(10));
/*****************************************************************************