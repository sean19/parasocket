"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventInfo {
    constructor(evt, fc) {
        this.evt = evt;
        this.fc = fc;
    }
    callfc(param) {
        this.fc.apply(null, param);
    }
    dispose() {
        this.fc = null;
    }
}
exports.EventInfo = EventInfo;
//# sourceMappingURL=EventInfo.js.map