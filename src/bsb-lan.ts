import { NodeAPI, Node, NodeMessageInFlow } from "node-red";

import { BSBLanDeviceNode } from "./interfaces";

export = function (RED: NodeAPI) {
    function NodeBsbLan(this: Node, config: any) {
        RED.nodes.createNode(this, config);

        let node = this;
        let device = RED.nodes.getNode(config.device) as BSBLanDeviceNode;

        this.on('input', function (msg: NodeMessageInFlow & {}) {

            let action: Promise<any>;

            switch (config.requesttype) {
                case "GET":
                    action = device.get('JQ=' + config.parameters.join(','));
                    break;
                case "SET":
                case "INF":
                    if (config.parameters.length == 1) {
                        action = device.post('JS',
                            {
                                "Parameter": config.parameters[0],
                                "Value": config.value,
                                "Type": config.requesttype == "INF" ? "0" : "1" // "Type" (0 = INF, 1 = SET) 
                            }
                        );
                    }
                    break;
            }

            if (action) {
                action
                    .then((result) => {
                        msg.payload = result;
                        node.send(msg);
                    })
                    .catch((error) => {
                        msg.payload = 'error ' + error;
                        node.send(msg);
                    });
            }
        });

        this.on('close', function () {

        });
    }

    RED.nodes.registerType("bsb-lan", NodeBsbLan);
};
