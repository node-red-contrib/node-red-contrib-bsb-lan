import { NodeAPI, Node, NodeMessageInFlow } from "node-red";

import { BSBLanDeviceNode } from "./interfaces";

export = function (RED: NodeAPI) {
    function NodeBsbLan(this: Node, config: any) {
        RED.nodes.createNode(this, config);

        let node = this;
        let device = RED.nodes.getNode(config.device) as BSBLanDeviceNode;

        this.on('input', function (msg: NodeMessageInFlow & { }) {
           device.get('JQ='+ config.values.join(','))
            .then((result) => { 
                msg.payload = result; 
                node.send(msg);
            })
            .catch((error)=>{
                msg.payload = 'error '+ error;
                node.send(msg);
            });
           
        });

        this.on('close', function () {
        
        });
    }

    RED.nodes.registerType("bsb-lan", NodeBsbLan);
};
