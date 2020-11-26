import { EditorRED, EditorNodeDef } from "node-red";
declare var RED: EditorRED;
import { Credentials, MikrotikDeviceConfig } from "node-red-contrib-bsb-lan/src/interfaces";

RED.nodes.registerType('mikrotik-device', {
    category: 'config',
    defaults: {
        host: { value: '192.168.0.1', required: true },
        port: { value: 80, required: true, validate: RED.validators.number() },
    },
    label: function () {
        return this.host + ':' + this.port;
    },
    credentials: {
        username: { type: "text" },
        password: { type: "password" },
        key: { type: "password" }
    },
   

} as EditorNodeDef<any, any,  { credentials: any, host: string, port: string }>);

