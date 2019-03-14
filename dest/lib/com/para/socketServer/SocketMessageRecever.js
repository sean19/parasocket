"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketPackage_1 = require("../SocketPackage");
class SocketMessageRecever {
    constructor(dafc) {
        this.data_handler = dafc;
    }
    dispose() {
        this.data_handler = null;
        this.clear();
    }
    clear() {
    }
    //======================
    receiveData(servername, u8a) {
        this.addReceiveDate(u8a);
        var u8a2 = this.receiveDate;
        while (u8a2.length >= 10) {
            var pkg = new SocketPackage_1.SocketPackage(servername, -1);
            u8a2 = pkg.readBuffer(u8a2);
            if (pkg.can_send) {
                this.receiveDate = u8a2;
                this.sendpkg(pkg);
            }
            else {
                return;
            }
        }
    }
    addReceiveDate(u8a) {
        if (this.receiveDate == null) {
            this.receiveDate = u8a;
        }
        else {
            if (u8a.length > 0) {
                var newuarr = new Uint8Array(this.receiveDate.length + u8a.length);
                newuarr.set(this.receiveDate, 0);
                newuarr.set(u8a, this.receiveDate.length);
                this.receiveDate = newuarr;
            }
        }
    }
    sendpkg(pkg) {
        if (this.data_handler) {
            this.data_handler.apply(null, [pkg]);
        }
    }
}
exports.SocketMessageRecever = SocketMessageRecever;
//# sourceMappingURL=SocketMessageRecever.js.map