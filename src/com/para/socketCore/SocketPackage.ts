/**
 *数据包处理
 demon
 */
import {isNumber} from "util";

export class SocketPackage {
    private _buffer:Buffer;
    private _cmd_type: number;
    private serverName:string;
    private  _info_length:number;
    private  _head_length:number=10;

    public socketid:number=0;

    public  _index:number= 0;
    public  static pkg_index:number= 0;

    public static len_head:number= 10;
    public static idx_socketid:number=0;
    public static idx_protolen:number=2;
    public static idx_cmdid:number=6;
    public get cmdType():number
    {
        return this._cmd_type;
    }
    /**cmdtype 为-1则*/
    constructor(serverName:string,cmdtype:number = -1)
    {
        this.serverName = serverName;
        if(cmdtype!=-1)
        {
            this._cmd_type = cmdtype;
            this.initHead();
        }
    }

    protected initHead():void{
        this._buffer = Buffer.alloc(10);
        // this._buffer.writeInt8(0,0);
        // this._buffer.writeInt8(0,1);
        this._buffer.writeUInt32BE(0,SocketPackage.idx_protolen);
        this._buffer.writeUInt32BE(this._cmd_type,SocketPackage.idx_cmdid);

    }
    public can_send : boolean=false;
    public readBuffer( u8a:Uint8Array ):Uint8Array
    {
        var buffer:Buffer = new Buffer(u8a);
        var h1:Number = buffer .readInt8(0);
        var h12:Number = buffer .readInt8(1);
        this._info_length = buffer.readUInt32BE(SocketPackage.idx_protolen);
        this._cmd_type = buffer.readUInt32BE(SocketPackage.idx_cmdid);
        var bufferlen:number = this._head_length+this._info_length;

        if(buffer.length<bufferlen){
            this.can_send = false;
            return u8a;
        }


        this._buffer =new Buffer(buffer.subarray(0,bufferlen));
        var u8a2:Uint8Array = u8a.subarray(bufferlen);
        var len:number = u8a2.length;

        this.can_send = true;
        return u8a2;
    }

    public putBytes( buffer:any )
    {
        var len:number =  this._buffer.writeUInt32BE( buffer.byteLength ,SocketPackage.idx_protolen);
        this._buffer = Buffer.concat( [this._buffer,buffer]);
    }

    public  get buffer():Buffer
    {
        return this._buffer;
    }

    public get protoBuf():Buffer
    {
        this._info_length = this._buffer.readInt32BE(SocketPackage.idx_protolen);
        var buf:Buffer = new Buffer(this._info_length);
        this._buffer.copy(buf,0,SocketPackage.len_head);
        return buf;
    }

}
