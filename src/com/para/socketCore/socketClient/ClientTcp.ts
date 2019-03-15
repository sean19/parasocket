import {ParaSocket} from "../ParaSocket";
import {EnumSocketEvent} from "../socketEvent/EnumSocketEvent";
import {InfoClient} from "../info/InfoClient";
import {SocketPackage} from "../SocketPackage";
import {SocketMessageRecever} from "../socketServer/SocketMessageRecever";
import {Socket} from "net";
import {TcpClientBase} from "../core/TcpClientBase";

export class ClientTcp extends TcpClientBase{
    public _is_alive: boolean = true;
    private inputPkgList: SocketPackage[] = [];
    protected receiver: SocketMessageRecever;
    private handlling: boolean = false;

    public constructor( infoClient: InfoClient )
    {
        super(infoClient);
        this.receiver = new SocketMessageRecever(this.onReceivePkg.bind(this));
        this.start();
    }
    public start()
    {
        console.log("开始客户端的连接模块:"+this.infoClient.ipAddress+":"+this.infoClient.port);
        this.onStartConnect();
    }
    protected onStartConnect(): void {
        if (this._is_alive == false) return;
        this.infoClient.socket = new Socket();
        let self = this;
        this.addEvent();
        var connnectStr:string = this.infoClient.ipAddress+":"+this.infoClient.port;
        this.infoClient.socket.connect(this.infoClient.port, this.infoClient.ipAddress, function () {
            self.onConnected(connnectStr);
        });
    }
    protected onConnected(connnectStr:string): void
    {
        if(this._is_alive==false){
            console.log('客户端连接'+connnectStr+'成功,但是这个已经被干掉了,当出现这个提示请检查代码！');
            return;
        }
        console.log('客户端连接'+connnectStr+'成功');
        ParaSocket.socketEventCenter.callEvent(EnumSocketEvent.client_connected, [this.infoClient.serverName, connnectStr]);
    }


    protected onmessage(u8a: Uint8Array): void {
        if (this._is_alive == false) return;
        this.receiver.receiveData(this.infoClient.serverName, u8a);
    }

    protected onReceivePkg(pkg: SocketPackage): void {
        this.inputPkgList.push(pkg);
        this.loopHandlerPkgList();
    }
    private async loopHandlerPkgList() {
        if (this.handlling || this.inputPkgList.length == 0) {
            return;
        }
        this.handlling = true;
        let pkg = this.inputPkgList.shift();
        try {
            await this.handlerPkg(pkg);
        } catch (e) {
            ParaSocket._log.onErr("句柄解析错误:" + pkg.cmdType + ":" + (e.stack || e));
        } finally {
            this.handlling = false;
            this.loopHandlerPkgList();
        }
    }


    public sendPkg(pkg: SocketPackage): void {
        try {
            if (this._is_alive) {
                this.infoClient.socket.write(pkg.buffer);
            }
        } catch (err) {
            ParaSocket._log.onErr("sendPkg failed");
        }
    }

//====================================================================
    protected onClose(): void {

        if (this._is_alive == false)
            return;
        this.removeMe();
    }
    protected onEnd(): void {
        if (this._is_alive == false)
            return;
        this.removeMe();
    }
    protected onError(): void {
        if (this._is_alive == false)
            return;
        this.removeMe();
    }
    protected removeMe(): void {
        ParaSocket.removeClient(this.infoClient.serverName);
    }
    //====================================================================
    public clear(): void {

        if (this._is_alive == false) {
            return;
        }
        this._is_alive = false;
        ParaSocket.socketEventCenter.callEvent(EnumSocketEvent.client_disConnect, [this.infoClient.serverName, this.infoClient.id]);
        this.removeMe();
        this.removeEvent();
        this.clearClientInfo();
        this.clearReceiver();
        this.clearSocketData();
    }

    protected clearSocketData(): void {
        if (this.socketData) {
            this.socketData.dispose();
            this.socketData = null;
        }
    }
    /**
     * 清理数据处理器
     */
    protected clearReceiver(): void {
        if (this.receiver) {
            this.receiver.dispose();
            this.receiver = null;
        }
    }

    /**
     * 清理clientInfo
     */
    protected clearClientInfo(): void {
        if (this.infoClient) {
            this.removeEvent();
            this.infoClient.dispose();
            this.infoClient = null;

        }
    }
    protected addEvent(): void {
        if (this.infoClient != null) {
            this.infoClient.socket.addListener('data', this.onmessage.bind(this));
            this.infoClient.socket.addListener('close', this.onClose.bind(this));
            this.infoClient.socket.addListener('end', this.onEnd.bind(this));
            this.infoClient.socket.addListener('error', this.onError.bind(this));

        }
    }
    protected removeEvent(): void {
        if (this.infoClient != null) {
            this.infoClient.socket.removeListener('data', this.onmessage.bind(this));
            this.infoClient.socket.removeListener('close', this.onClose.bind(this));
            this.infoClient.socket.removeListener('end', this.onEnd.bind(this));
            this.infoClient.socket.removeListener('error', this.onError.bind(this));
        }
    }

}