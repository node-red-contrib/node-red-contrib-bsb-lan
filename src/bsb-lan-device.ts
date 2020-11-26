import { NodeAPI, Node, NodeDef } from "node-red";


export = function (RED: NodeAPI) {
    function NodeConstructorMikrotikDevice(this: Node<any>, def: NodeDef & {} ) {
        RED.nodes.createNode(this, def);

        // TODO add def for Host & Port
        // this.host = def.host;
        // this.port = def.port;
        

    }

    RED.nodes.registerType("mikrotik-device", NodeConstructorMikrotikDevice, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" },
            key: { type: "password" }
        }
    });
}