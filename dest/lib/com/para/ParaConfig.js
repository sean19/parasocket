"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParaSocket_1 = require("./ParaSocket");
const InfoServer_1 = require("./info/InfoServer");
const InfoClient_1 = require("./info/InfoClient");
class ParaConfig {
    constructor() {
        this.arrInfoServer = [];
        this.ipv4 = "";
        this.is_get_ip = false;
    }
    addServerInfo(sid, serverName, port, path, ipadress = "0", isclient = false) {
        var sv;
        if (isclient) {
            sv = new InfoClient_1.InfoClient(sid, serverName, ipadress, port);
        }
        else {
            sv = new InfoServer_1.InfoServer(sid, serverName, port, path, ipadress);
        }
        this.arrInfoServer.push(sv);
        return sv;
    }
    getServerInfoByName(serverName) {
        for (var i = 0; i < this.arrInfoServer.length; i++) {
            var server = this.arrInfoServer[i];
            if (server.serverName == serverName) {
                return server;
            }
        }
        return null;
    }
    TryStart(fc) {
        // console.log('this.ipv4='+this.ipv4)
        if (this.ipv4 != "") {
            fc.apply(null);
        }
        else {
            this.TryGetIpv4(fc);
        }
    }
    TryGetIpv4(fc) {
        var os = require('os');
        var ifaces = os.networkInterfaces();
        for (var dev in ifaces) {
            var alias = 0;
            ifaces[dev].forEach(function (details) {
                if (details.family == 'IPv4') {
                    ++alias;
                    var adsStr = details.address;
                    if (ParaSocket_1.ParaSocket.config.is_get_ip == false && adsStr.substr(0, 3) != "127" && adsStr.substr(0, 2) != "10") {
                        console.log(dev + (alias ? ':' + alias : ''), details.address);
                        ParaSocket_1.ParaSocket.config.ipv4 = adsStr;
                        // ParaSocket.config.ipv4 = "127.0.0.1";
                        ParaSocket_1.ParaSocket.config.is_get_ip = true;
                        fc.apply(null);
                        // Reflect.apply(fc,thisArgument,[]);
                    }
                }
            });
        }
    }
}
exports.ParaConfig = ParaConfig;
//# sourceMappingURL=ParaConfig.js.map