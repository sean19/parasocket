import {EnumServerType, ParaSocket} from "./ParaSocket";

export class ExampleClient1 {
    constructor(){
        this.init();
    }
    public async init(){
        ParaSocket.showLog = true;
        ParaSocket.addClient(0,'user1',8082,'192.168.3.52');
    }

}