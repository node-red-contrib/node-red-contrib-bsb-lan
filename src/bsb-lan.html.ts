import { EditorRED, EditorNodeDef } from "node-red";
declare var RED: EditorRED;

RED.nodes.registerType('bsb-lan', {
    category: 'network',
    color: '#E9967A',
    defaults: {
        device: { value: '', type: "bsb-lan-device" },
        name: { value: '' },
        action: { value: '0' },
        command: { value: '' },
        "command-type": { value: 'str' }
    },
    inputs: 1,
    outputs: 1,
    icon: "feed.png",
    label: function () {
        return this.name || "bsb-lan";
    },
    oneditprepare: function () {
        let node = this;
     
      
    },
    oneditsave: function () {
 
    }
});