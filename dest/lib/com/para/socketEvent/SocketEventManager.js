"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventInfo_1 = require("./EventInfo");
class SocketEventManager {
    constructor() {
        this.arr_info = [];
    }
    addCallBack(evt, fc) {
        if (this.getEvent(evt, fc) != null)
            return;
        this.arr_info.push(new EventInfo_1.EventInfo(evt, fc));
    }
    removeCallBack(evt, fc) {
        for (var i = 0; i < this.arr_info.length; i++) {
            var info = this.arr_info[i];
            if (info.evt == evt && info.fc == fc) {
                info.dispose();
                this.arr_info.splice(i, 1);
                return;
            }
        }
    }
    callEvent(evt, param) {
        for (var i = 0; i < this.arr_info.length; i++) {
            var info = this.arr_info[i];
            if (info.evt == evt) {
                info.callfc(param);
            }
        }
    }
    getEvent(evt, fc) {
        for (var i = 0; i < this.arr_info.length; i++) {
            var info = this.arr_info[i];
            if (info.evt == evt && info.fc == fc) {
                return info;
            }
        }
        return null;
    }
}
exports.SocketEventManager = SocketEventManager;
//# sourceMappingURL=SocketEventManager.js.map