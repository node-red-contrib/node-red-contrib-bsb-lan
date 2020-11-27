import { NodeAPI, Node, NodeMessageInFlow } from "node-red";

import { BSBLanDeviceNode } from "./interfaces";

export = function (RED: NodeAPI) {
    function NodeBsbLan(this: Node, config: any) {
        RED.nodes.createNode(this, config);

        let device = RED.nodes.getNode(config.device) as BSBLanDeviceNode;

        this.on('input', function (msg: NodeMessageInFlow & { }) {
           
        });

        this.on('close', function () {
        
        });
    }

    RED.nodes.registerType("bsb-lan", NodeBsbLan);
};
