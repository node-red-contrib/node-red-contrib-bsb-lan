
import { Node } from "node-red";

export interface Credentials {
    username: string;
    password: string;
    key: string;
}

export interface BSBLanDeviceNodeConfig {
    host: string;
    port: number;
}

export interface BSBLanDeviceNode extends Node<Credentials>
{
    get: (query: string) => Promise<any>
}
