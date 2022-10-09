import { NodeAPI, Node, NodeDef } from "node-red";
import { Credentials, BSBLanDeviceNodeConfig, BSBLanDeviceNode } from "./interfaces";
import axios from "axios";

export default function (RED: NodeAPI) {
    function NodeConstructorBSBLanDevice(this: BSBLanDeviceNode, def: NodeDef & BSBLanDeviceNodeConfig) {
        RED.nodes.createNode(this, def);

        let url = 'http://' + def.host + ':' + def.port + ((!this.credentials.key) ? '' : '/' + this.credentials.key);

        let headers = {};

        if (this.credentials?.username || this.credentials?.password) {
            headers = {
                'Authorization': 'Basic ' + Buffer.from(this.credentials.username + ':' + this.credentials.password).toString('base64')
            };
        }


        this.get = async (query: string) => {
            return (await axios( 
                {
                    method: 'GET',
                    url: url + '/' + query,
                    headers: headers, 
                    insecureHTTPParser: true
                })).data;
        };

        this.post = async (query: string, body: object) => {
            return (await axios(
                {
                    method: "POST",
                    url: url + '/' + query,
                    data: JSON.stringify(body),
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json'
                    },
                    insecureHTTPParser: true
                })).data;
        }
    }

    // register only one namepaced http get handler that take care per "bsb-lan-device" with the id
    RED.httpAdmin.get('/bsb-lan/:id/:type',
        RED.auth.needsPermission('bsb-lan.read'),
        (req, res) => {
            try {
                (RED.nodes.getNode(req.params.id) as BSBLanDeviceNode)
                    .get(req.params.type)
                    .then((result) => {
                        res.status(200).send(result);
                    })
                    .catch((error) => {
                        res.status(500).send({ error: error });
                    });
            }
            catch (error) {
                res.status(500).send({ error: error });
            }
        });

    RED.nodes.registerType("bsb-lan-device", NodeConstructorBSBLanDevice, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" },
            key: { type: "password" }
        }
    });
}