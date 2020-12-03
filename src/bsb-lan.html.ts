import { EditorRED, EditorNodeDef } from "node-red";
declare var RED: EditorRED;

RED.nodes.registerType('bsb-lan', {
    category: 'network',
    color: '#E9967A',
    defaults: {
        device: { value: '', type: "bsb-lan-device" },
        name: { value: '' },
        requesttype: { value: 'GET' },
        parameters: { value: [] },
        value: { value: '' },
    },
    inputs: 1,
    outputs: 1,
    icon: "font-awesome/fa-fire",
    label: function () {
        return this.name || "bsb-lan";
    },
    oneditprepare: function () {
        type Trequesttype = "GET" | "INF" | "SET";

        let node = (this as any) as { _parameters: string[] };

        node._parameters = ([].concat(this.parameters ?? [])).sort();

        const labelParameters =  $('#node-label-parameters');
        const labelParameter =  $('#node-label-parameter');
        const rowValue = $('#node-row-value');
        const inputRequestType = $('#node-input-requesttype');
        const inputDevice = $('#node-input-device');

        const treeList: any = $("<div>")
            .css({ width: "100%", height: "300px" })
            .appendTo("#node-row-parametertree");
        treeList.treeList({});

        function loadData() {

            let requesttype = inputRequestType.val() as Trequesttype;
            let id = inputDevice.val() as string;

            if (!(requesttype == "GET") && node._parameters.length > 1) {
                node._parameters = [node._parameters[0]];
                updateparameters();
            }

            treeList.treeList('empty');
            let fetchPath = 'bsb-lan/' + id + '/JK=';
            $.getJSON(fetchPath + 'ALL', function (data) {
                let i = 0;
                let tree = [];

                for (let key in data) {
                    let item = data[key];

                    if (requesttype == "INF" && (item.min < 10000 || item.min >=15000))
                        continue;

                    let leaf = {
                        label: item.name + ' (' + item.min + '-' + item.max + ')',
                        id: "Category:" + key,
                        children: function (fetchedData) {
                            let subTree = [];
                            $.getJSON(fetchPath + key, function (elementData) {
                                for (let keyElement in elementData) {

                                    let id = parseInt(keyElement,10);
                                    if (requesttype == "INF" && (id < 10000 || id >=10005))
                                        continue;

                                    let itemElement = elementData[keyElement];
                                    let subLeaf: any = {
                                        label: itemElement.name + ' (' + keyElement + ')',
                                        id: keyElement,
                                        selected: node._parameters.includes(keyElement)
                                    }
                                    if (requesttype == "GET") {
                                        subLeaf = {
                                            ...subLeaf,
                                            checkbox: true,
                                        }
                                    }

                                    if (requesttype == "GET" || itemElement.readonly == 0)
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

        inputDevice.on('change', function () { loadData(); });

        inputRequestType.on('change', function () {
            let requesttype = inputRequestType.val() as Trequesttype;
            if (requesttype == "GET")
            {
                labelParameters.show();
                labelParameter.hide();
                rowValue.hide();
            }
            else
            {
                labelParameter.show();
                labelParameters.hide()
                rowValue.show();
            }

            loadData();
        });

        function updateparameters() {
            const text = node._parameters.sort().join(',');
            $('#node-parameters').val(text);
        }

        updateparameters();

        treeList.on('treelistselect', function (event, item) {

            if (item.selected != undefined) {

                let reqType = $('#node-input-requesttype').val() as Trequesttype;

                if (reqType == 'GET') {

                    if (item.selected) {
                        node._parameters.push(item.id);
                    } else {
                        const index = node._parameters.indexOf(item.id);
                        if (index > -1) {
                            node._parameters.splice(index, 1);
                        }
                    }
                }
                else
                {
                    node._parameters=[];
                    if (!isNaN(parseInt(item.id, 10))) {
                        node._parameters.push(item.id);
                    }
                }
                updateparameters();
            }
        });
    },
    oneditsave: function () {
        let node = this as any;

        node.parameters = node._parameters;
        delete node._parameters;
    }
});