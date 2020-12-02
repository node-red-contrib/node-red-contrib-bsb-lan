import { EditorRED, EditorNodeDef } from "node-red";
declare var RED: EditorRED;

RED.nodes.registerType('bsb-lan', {
    category: 'network',
    color: '#E9967A',
    defaults: {
        device: { value: '', type: "bsb-lan-device" },
        name: { value: '' },
        requesttype: { value: 'GET' },
        values: { value: [] },
    },
    inputs: 1,
    outputs: 1,
    icon: "font-awesome/fa-fire",
    label: function () {
        return this.name || "bsb-lan";
    },
    oneditprepare: function () {

        let node = (this as any) as { _values: string[] };

        node._values = ([].concat(this.values ?? [])).sort();

        debugger;

        const treeList: any = $("<div>")
            .css({ width: "100%", height: "300px" })
            .appendTo(".node-input-browse-row");
        treeList.treeList({});

        function loadData(id: string, get: boolean) {
            if (!get && node._values.length > 1) {
                node._values = [node._values[0]];
                updateValues();
            }

            treeList.treeList('empty');
            let fetchPath = 'bsb-lan/' + id + '/JK=';
            $.getJSON(fetchPath + 'ALL', function (data) {
                let i = 0;
                let tree = [];

                for (let key in data) {
                    let item = data[key];

                    let leaf = {
                        label: item.name + ' (' + item.min + '-' + item.max + ')',
                        id: "Category:" + key,
                        children: function (fetchedData) {
                            let subTree = [];
                            $.getJSON(fetchPath + key, function (elementData) {
                                for (let keyElement in elementData) {
                                    let itemElement = elementData[keyElement];
                                    let subLeaf: any = {
                                        label: itemElement.name + ' (' + keyElement + ')',
                                        id: keyElement,
                                        selected: node._values.includes(keyElement)
                                    }
                                    if (get) {
                                        subLeaf = {
                                            ...subLeaf,
                                            checkbox: true,
                                        }
                                    }
                                    // in the future reduce for INF messages
                                    if (get || itemElement.readonly == 0)
                                        subTree.push(subLeaf);
                                }
                                fetchedData(subTree);
                            });
                        }
                    };
                    tree.push(leaf);
                }
                treeList.treeList('data', tree);
            });
        }

        $('#node-input-device').on('change', function () {
            let reqType = $('#node-input-requesttype').val();
            let device = $('#node-input-device').val() as string;
            loadData(device, reqType == 'GET');
        });

        $('#node-input-requesttype').on('change', function () {
            let reqType = $('#node-input-requesttype').val();
            let device = $('#node-input-device').val() as string;
            loadData(device, reqType == 'GET');
        });

        function updateValues() {
            const text = node._values.sort().join(',');
            $('#node-values').val(text);
        }

        updateValues();

        treeList.on('treelistselect', function (event, item) {

            if (item.selected != undefined) {

                let reqType = $('#node-input-requesttype').val();

                if (reqType == 'GET') {

                    if (item.selected) {
                        node._values.push(item.id);
                    } else {
                        const index = node._values.indexOf(item.id);
                        if (index > -1) {
                            node._values.splice(index, 1);
                        }
                    }
                }
                else
                {
                    node._values=[];
                    if (!isNaN(parseInt(item.id, 10))) {
                        node._values.push(item.id);
                    }
                }
                updateValues();
            }
        });
    },
    oneditsave: function () {
        let node = this as any;

        node.values = node._values;
        delete node._values;
    }
});