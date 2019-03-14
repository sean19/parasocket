import {SocketData} from "./socketCore/socketServer/SocketData";

export declare class ParaSocket {
    public static showClientsInserver(serverName:string):void;
    public static registorServerSocketData(servername:string,socketData:Function):void;

    static showLog:boolean;
    static onen_connect:boolean;

    /**
     * 添加服务器
     * @param {number} serid
     * @param {string} serverName
     * @param {number} port
     */
    public static addServer(serid:number,serverName:string,port:number):void;
    /**
     * 添加socket客户端
     * @param {number} serid
     * @param {string} serverName
     * @param {number} port
     * @param {string} ipaddress
     */
    public static addClient(serid:number,serverName:string,port:number,ipaddress:string ):void;

    /**
     * !!注意如果是服务端的连接客户是===getServerClientData()
     * 根据名字获取客户端的socketData
     * @param {string} clientName
     * @returns {SocketData}
     */
    public static getClientData(clientName:string):SocketData;
    /**
     * 获取连接到服务器的客户端的socketData
     * @param {string} serverName
     * @param {number} socketid
     * @returns {SocketData}
     */
    public static getServerClientData(serverName:string,socketid:number):SocketData;
    /**
     * 客户端发送二进制数据到服务器
     * @param {string} clientName
     * @param {number} cmdid
     * @param {Buffer} bu
     */
    public static sendmsg2Server(clientName:string,cmdid:number,buff:Buffer):void;
    /**
     * 发送二进制数据到客户端
     * @param {string} serverName 服务器名字
     * @param {number} socketid 在服务器上的socketid
     * @param {number} cmdid 命令id
     * @param {Buffer} buff
     */
    public static sendmsg2Client(serverName:string,socketid:number,cmdid:number,buff:Buffer):void;
    /**
     * 添加消息的回调方法
     * @param {string} servername
     * @param {number} cmdID
     * @param {Function} callback
     */
    public static addCallback(servername:string,cmdID:number,callback:(name:string,socketid:number,cmdid:number, buffer:Buffer) => void):void;
    /**
     * !注意如果是服务端的连接是===removeClient()
     * 删除一个客户端
     * @param {string} clientName
     */
    public static removeClient(clientName:string):void;
    /**
     * 删除一个在服务器上的客户端
     * @param {string} serverName
     * @param {number} socketid
     */
    public static removeClientOnServer(serverName:string,socketid:number): void;

}
