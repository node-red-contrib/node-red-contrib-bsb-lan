import { NodeAPI, Node, NodeMessageInFlow } from "node-red";

export = function (RED: NodeAPI) {
    function NodeBsbLan(this: Node, config: any) {
        RED.nodes.createNode(this, config);
        let node = this;


        this.on('input', function (msg: NodeMessageInFlow & { }) {
           
        });

        this.on('close', function () {
        
        });
    }

    RED.nodes.registerType("bsb-lan", NodeBsbLan);
};
