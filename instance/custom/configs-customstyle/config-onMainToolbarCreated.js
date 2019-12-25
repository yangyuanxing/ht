(function() {

    window.hteditor_config.onMainToolbarCreated = function(editor) {

        var mainToolbar = editor.mainToolbar;

        // Hide some items from main toolbar
        mainToolbar.setItemVisible('Star', false);
        mainToolbar.setItemVisible('star', false);
        mainToolbar.setItemVisible('Triangle', false);
        mainToolbar.setItemVisible('triangle', false);

        // remove items from main toolbar
        mainToolbar.removeItemById('Node');
        mainToolbar.removeItemById('Group');
        mainToolbar.removeItemById('SubGraph');
        mainToolbar.removeItemById('Edge');

        // Add some items to main toolbar
        addItemsForDisplay(editor);
        addItemsForSymbol(editor);

        updateToolbar(editor);
    };

    function updateToolbar(editor) {
        var mainToolbar = editor.mainToolbar,
            rightToolbar = editor.rightToolbar;

        mainToolbar.addItem({
            separator: true,
            visible: function() {
                return !!editor.currentView;
            }
        });

        var save = rightToolbar.getItemById('save'),
            preview = rightToolbar.getItemById('preview')
            rightTools = rightToolbar.getItems().splice(0, 14);
        
        rightTools.splice(rightTools.indexOf(save), 1);
        rightTools.splice(rightTools.indexOf(preview), 1);

        rightToolbar.getItems().unshift(preview);
        rightToolbar.getItems().unshift(save);
        rightToolbar.iv();

        rightTools.forEach(function (item) {
            mainToolbar.addItem(item);
        });
        mainToolbar.setItemVisible('zoomIn', false);
        mainToolbar.setItemVisible('zoomOut', false);
        mainToolbar.iv();
        
        mainToolbar.addItem({
            separator: true,
            visible: function() {
                return !!editor.currentView;
            }
        });

        var alignBtns = editor.inspectorTool.getRows()[0].items.slice(0, 8),
            alignCombo = new ht.widget.ComboBox(),
            icons = [],
            values = [],
            actions = [],
            currentAction = null;;

        alignBtns.forEach(function (item) {
            var button = item.element;
            icons.push(button.getIcon());
            values.push(button.getToolTip());
            actions.push(button.onClicked);
        });
        currentAction = actions[0];

        alignCombo.setWidth(22);
        alignCombo.setBackground(null);
        // alignCombo.setBorderColor(null);
        alignCombo.setDropDownWidth(80);
        alignCombo.setValues(values);
        alignCombo.setIcons(icons);
        alignCombo.getView().style.borderWidth = 0;
        var codeTriggerChange = false;
        alignCombo.onValueChanged = function(oldVal, newVal) {
            if (codeTriggerChange) return;
            var index = values.indexOf(newVal);
            mainToolbar.getItemById('align').icon = icons[index];
            mainToolbar.getItemById('align').toolTip = alignBtns[index].element.getToolTip();
            mainToolbar.iv();
            currentAction = actions[index];
            currentAction();
            codeTriggerChange = true;
            this.setValue(null);
            codeTriggerChange = false;
        }

        mainToolbar.addItem({
            id: 'align',
            action: function() {
                currentAction();
            },
            icon: icons[0],
            // unfocusable: true,
            // toolTip: button.getToolTip(),
            // disabled: true,
            visible: function() {
                return !!editor.currentView;
            },
            element: alignCombo
        });
    } 

    function addItemsForDisplay(editor) {
        var mainToolbar = editor.mainToolbar;
        var S = hteditor.getString;

        var id, toolTip, icon, type, initData;

        mainToolbar.addItem({
            separator: true,
            visible: function() {
                return !!editor.displayView;
            }
        });

        id = 'Node';
        toolTip = S('editor.node');
        icon = 'editor.display.node';
        type = ht.Node;
        initData = function(data) {
            data.setImage('symbols/basic/node.json');
        };
        mainToolbar.addItem(editor.createDisplayItem(id, toolTip, icon, type, initData));

        id = 'Group';
        toolTip = S('editor.group');
        icon = 'editor.display.group';
        type = ht.Group;
        initData = function(data) {
            data.setExpanded(true);
            data.setImage('symbols/basic/group.json');
            data.s({
                'label': ' '
            });
        };
        mainToolbar.addItem(editor.createDisplayItem(id, toolTip, icon, type, initData));

        id = 'SubGraph';
        toolTip = S('editor.subgraph');
        icon = 'editor.display.subgraph';
        type = ht.SubGraph;
        initData = function(data) {
            data.setImage('symbols/basic/subgraph.json');
        };
        mainToolbar.addItem(editor.createDisplayItem(id, toolTip, icon, type, initData));

        id = 'Edge';
        toolTip = S('editor.edge');
        icon = 'editor.display.edge';
        type = ht.Edge;
        initData = function(data) {
            data.s({
                'edge.color': '#009687',
                'edge.width': 1
            });
        };
        mainToolbar.addItem(editor.createDisplayItem(id, toolTip, icon, type, initData));

        mainToolbar.addItem({
            separator: true,
            visible: function() {
                return !!editor.displayView;
            }
        });

        id = 'VProgressBar';
        toolTip = S('VProgressBar');
        icon = 'custom/images/vprogressbar.json';
        type = ht.Node;
        initData = function(data) {
            data.setImage('symbols/basic/vProgressBar.json');
            data.a({
                'pb.value.visible': false,
                'pb.fore.color': "#3399FF",
                'pb.background': "#38373B"
            });
        };
        mainToolbar.addItem(editor.createDisplayItem(id, toolTip, icon, type, initData));

        id = 'HProgressBar';
        toolTip = S('HProgressBar');
        icon = 'custom/images/hprogressbar.json';
        type = ht.Node;
        initData = function(data) {
            data.setImage('symbols/basic/hProgressBar.json');
            data.a({
                'pb.value.visible': false,
                'pb.fore.color': "#3399FF",
                'pb.background': "#38373B"
            });
        };
        mainToolbar.addItem(editor.createDisplayItem(id, toolTip, icon, type, initData));

        id = 'Table';
        toolTip = S('Table');
        icon = 'custom/images/table.json';
        type = ht.Node;
        initData = function(data) {
            data.setImage('symbols/basic/table.json');
            data.a({
                'table.background': null,
                'table.line.color': '#3399FF'
            });
        };
        mainToolbar.addItem(editor.createDisplayItem(id, toolTip, icon, type, initData));

        id = 'Clock';
        toolTip = S('Clock');
        icon = 'custom/images/clock.json';
        type = ht.Node;
        initData = function(data) {
            var date = new Date();
            data.setImage('symbols/basic/clock.json');
            data.a({
                'clock.second': date.getSeconds(),
                'clock.minute': date.getMinutes(),
                'clock.hour': date.getHours(),
                'clock.background': '#38373B',
                'clock.minute.color': '#3399FF',
                'clock.hour.color': '#3399FF',
                'clock.number.color': '#FFFFE0',
                'clock.border.color': '#FFCC99',
                'clock.scale.color': null

            });
        };
        mainToolbar.addItem(editor.createDisplayItem(id, toolTip, icon, type, initData));

        id = 'Pipe';
        toolTip = S('Pipe');
        icon = 'custom/images/pipe.json';
        type = ht.Shape;
        initData = function(data) {
            data.s({
                "shape.background": null,
                "shape.border.width": 10,
                "shape.dash": true,
                "shape.dash.pattern": [4, 8],
                "shape.dash.3d": true,
                "shape.dash.3d.color": "rgb(247,247,247)",
                "note.border.color": "rgb(61,61,61)",
                "border.color": "#929292",
                "shape.border.color": "#60ACFC",
                "shape.dash.color": "#929292",
                "border.width": 1
            });
        };
        mainToolbar.addItem(editor.createDisplayItem(id, toolTip, icon, type, initData));
    }

    function addItemsForSymbol(editor) {
        var mainToolbar = editor.mainToolbar;
        var S = hteditor.getString;

        var id, toolTip, icon, type, initComp;

        mainToolbar.addItem({
            separator: true,
            visible: function() {
                return !!editor.symbolView;
            }
        });

        id = 'vProgressBar';
        toolTip = S('VProgressBar');
        icon = 'custom/images/vprogressbar.json';;
        type = 'comp';
        initComp = function(comp, rect, click) {
            comp.type = 'components/progressBar/progressBar.json';
            comp.direction = 'v';
            comp.valueVisible = false;
            comp.foreColor = '#3399FF';
            comp.background = '#38373B';
            if (click) {
                comp.rect[2] = 10;
                comp.rect[3] = 30;
            }
        };
        mainToolbar.addItem(editor.createSymbolItem(id, toolTip, icon, type, initComp));

        id = 'hProgressBar';
        toolTip = S('HProgressBar');
        icon = 'custom/images/hprogressbar.json';
        type = 'comp';
        initComp = function(comp, rect, click) {
            comp.type = 'components/progressBar/progressBar.json';
            comp.direction = 'h';
            comp.valueVisible = false;
            comp.foreColor = '#3399FF';
            comp.background = '#38373B';
            if (click) {
                comp.rect[2] = 30;
                comp.rect[3] = 10;
            }
        };
        mainToolbar.addItem(editor.createSymbolItem(id, toolTip, icon, type, initComp));

        id = 'star';
        toolTip = S('editor.star');
        icon = 'editor.symbol.star';
        type = 'star';
        initComp = function(comp, rect, click) {
            comp.background = '#3399FF';
            comp.borderWidth = 1;
            comp.borderColor = '#38373B';
            comp.gradient = 'linear.southwest';
        };
        mainToolbar.addItem(editor.createSymbolItem(id, toolTip, icon, type, initComp));

    }

})();


