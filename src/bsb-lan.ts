import { NodeAPI, Node, NodeMessageInFlow } from "node-red";

import { BSBLanDeviceNode } from "./interfaces";

export = function (RED: NodeAPI) {
    function NodeBsbLan(this: Node, config: any) {
        RED.nodes.createNode(this, config);

        let node = this;
        let device = RED.nodes.getNode(config.device) as BSBLanDeviceNode;

        this.on('input', function (msg: NodeMessageInFlow & any) {

            let action: Promise<any>;

            let cfg = { ...config};

            if (msg?.requesttype == 'GET' || msg?.requesttype == 'SET' || msg?.requesttype == 'INF')
                cfg.requesttype= msg.requesttype;
             
            if (msg?.parameters?.length > 0)
                cfg.parameters= msg.parameters;

            if (msg.value != undefined)
                cfg.value = msg.value;

            switch (cfg.requesttype) {
                case "GET":
                    action = device.get('JQ=' + cfg.parameters.join(','));
                    break;
                case "SET":
                case "INF":
                    if (cfg.parameters.length == 1) {
                        action = device.post('JS',
                            {
                                "Parameter": cfg.parameters[0],
                                "Value": cfg.value,
                                "Type": cfg.requesttype == "INF" ? "0" : "1" // "Type" (0 = INF, 1 = SET) 
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
