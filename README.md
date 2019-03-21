# parasocket
* a tcp socket server and client application
* 1.0.26 add ParaSocket.d.ts

https://www.npmjs.com/package/parasocket
********************************************************************************
# how to  open log

* ParaSocket.showLog =true;//open para log
********************************************************************************
# how to add server

* step 1 declare a socket :ServerDate extends SocketData,has  clear function realization
* step2
    * ParaSocket.registorServerSocketData("user",ServerData);
* step3 add server
    * ParaSocket.addServer(0,"user",8081,EnumServerType.ipv4_server);
* step4 add callback function
    * ParaSocket.addCallback('user',1,(name:string,socketid:number,cmdid:number,buff:Buffer)=>{
        console.log("do something");
    });


********************************************************************************
# how to add client

* step 1 add client
    * ParaSocket.addClient(-1,"uu",8081,myip);
* step 2 add callback function
    * ParaSocket.addCmmandCallback('uu',2,(name:string,socketid:number,cmdid:number,buff:Buffer)=>{
        console.log("CLIENT:::::"+name+":socketid="+socketid+":CMDID:"+cmdid);
    })
* step 3 send message to server
    * ParaSocket.sendmsg2Server('uu',1,Buffer.alloc(10));
*****************************************************************************