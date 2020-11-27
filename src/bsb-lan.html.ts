import { EditorRED, EditorNodeDef } from "node-red";
declare var RED: EditorRED;

RED.nodes.registerType('bsb-lan', {
    category: 'network',
    color: '#E9967A',
    defaults: {
        device: { value: '', type: "bsb-lan-device" },
        name: { value: '' },
        values: { value: [] },
    },
    inputs: 1,
    outputs: 1,
    icon: "feed.png",
    label: function () {
        return this.name || "bsb-lan";
    },
    oneditprepare: function () {
        let node = this;
        debugger;
        if (!node.values)
            node.values = [];

        const treeList: any = $("<div>")
            .css({ width: "100%", height: "300px" })
            .appendTo(".node-input-browse-row");
        treeList.treeList({});

        function loadData(id: string) {
            treeList.treeList('empty');
            let fetchPath = 'bsb-lan/' + id + '/JK=';
            console.log(fetchPath);
            $.getJSON(fetchPath + 'ALL', function (data) {
                let i = 0;
                let tree = [];

                for (let key in data) {
                    let item = data[key];

                    let leaf = {
                        label: item.name + ' (' + item.min + '-' + item.max + ')',
                        id: key,
                        children: function (fetchedData) {
                            let subTree = [];
                            $.getJSON(fetchPath + key, function (elementData) {
                                for (let keyElement in elementData) {
                                    let itemElement = elementData[keyElement];
                                    let subLeaf = {
                                        label: itemElement.name + ' (' + keyElement + ')',
                                        id: keyElement,
                                        checkbox: true,
                                        selected: node.values.includes(keyElement)
                                    }
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
            loadData((this as any).value);
        });

        function updateValues() {
            const text = node.values.join(',');
            $('#node-values').val(text);
        }

        updateValues();

        treeList.on('treelistselect', function (event, item) {

            if (item.selected != undefined) {
                if (item.selected) {
                    node.values.push(item.id);
                } else {
                    const index = node.values.indexOf(item.id);
                    if (index > -1) {
                        node.values.splice(index, 1);
                    }
                }
                updateValues();
                console.log(node.values);
            }
        });
    },
    oneditsave: function () {

    }
});