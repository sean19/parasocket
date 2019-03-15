import {SocketPackage} from "../SocketPackage";
import {ParaSocket} from "../ParaSocket";
import {InfoClient} from "../info/InfoClient";
import {SocketMessageRecever} from "./SocketMessageRecever";
import {EnumSocketEvent} from "../socketEvent/EnumSocketEvent";
import {TcpClientBase} from "../core/TcpClientBase";

export class ServerTCPClient extends TcpClientBase{

    public _is_alive: boolean = true;
    protected receiver: SocketMessageRecever;
    private inputPkgList: SocketPackage[] = [];
    private handlling: boolean = false;
    public constructor(infoClient: InfoClient) {
        super(infoClient);
        this.receiver = new SocketMessageRecever(this.onReceivePkg.bind(this));
        //  new SocketDataServer(infoClient.serverName, infoClient.id);
        this.addEvent();

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
            ParaSocket.log("句柄解析错误:" + pkg.cmdType + ":" + (e.stack || e));
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

    public getid(): number {
        if (this.infoClient) {
            return this.infoClient.id;
        }
        return -1000;
    }
    public getisactive(): boolean {
        return this._is_alive;
    }
    //====================================================================

    public dispose(): void {

        if (this._is_alive == false) {
            return;
        }
        ParaSocket.socketEventCenter.callEvent(EnumSocketEvent.server_client_disConnect, [this.infoClient.serverName, this.getid()]);
        ParaSocket.log('客户端断开连接,socketId='+this.getid()+"server:"+this.infoClient.serverName+"::"+this.infoClient.ipAddress+":"+this.infoClient.port);
        this._is_alive = false;
        ParaSocket.socketEventCenter.callEvent(EnumSocketEvent.client_disConnect, [this.infoClient.serverName, this.infoClient.id]);
        this.removeMe();
        this.clear();
        this.removeEvent();
        this.clearClientInfo();
        this.clearReceiver();
        this.clearSocketData();

    }
    protected clear(): void {

    }

    protected clearSocketData(): void {
        if (this.socketData) {
            this.socketData.dispose();
            this.socketData = null;
        }
    }
    protected clearClientInfo(): void {
        if (this.infoClient) {
            ParaSocket.log('tcp离开: ' + this.infoClient.socket.remotePort+":"+this.infoClient.socket.remoteAddress  );
            this.removeEvent();
            this.infoClient.dispose();
            this.infoClient = null;

        }
    }
    protected clearReceiver(): void {
        if (this.receiver) {
            this.receiver.dispose();
            this.receiver = null;
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
        ParaSocket.removeClientOnServer(this.infoClient.serverName,this.getid());
    }

    public closeSocket(): void {
        try {
            this.infoClient.socket.end();
        } catch (e) {

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