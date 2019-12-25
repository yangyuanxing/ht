(function() {
    window.hteditor_config.onInspectorCreated = function(editor, params) {
        var inspector = params.inspector;

        if (inspector.type === 'Scene') return;

        addEventRow(inspector);
    };
    function addEventRow(inspector) {
        var items = [];
        var editor = inspector.editor;

        var dialog = new ht.widget.Dialog(),
            tabView = new ht.widget.TabView(),
            tabModel = tabView.getTabModel();

        [
            {name: '点击', eventName: 'onClick'},
            {name: '双击', eventName: 'onDoubleClick'},
            {name: '按下', eventName: 'onDown'},
            {name: '抬起', eventName: 'onUp'},
            {name: '移动', eventName: 'onMove'},
            {name: '进入', eventName: 'onEnter'},
            {name: '悬停', eventName: 'onHover'},
            {name: '离开', eventName: 'onLeave'},
            {name: '开始拖拽', eventName: 'onBeginDrag'},
            {name: '拖拽', eventName: 'onDrag'},
            {name: '结束拖拽', eventName: 'onEndDrag'},
            {name: '滚动', eventName: 'onScroll'},
        ].forEach(function(e, i) {
            var tab = new ht.Tab(),
                formPane = new ht.widget.FormPane();
            tab._eventName = e.eventName;
            formPane.addRow([
                e.eventName + ': function(event, data, view){'
            ], [0.1], 26);
            formPane.addRow([
                {
                    id: 'content',
                    element: new hteditor.CodeEditor({
                        // value: hteditor.stringifyFunction(func),
                        language: 'javascript',
                        minimap: {
                            enabled: false
                        }
                    })
                }
            ], [0.1], 0.1);
            formPane.addRow([
                '}'
            ], [0.1], 26);

            tab.setName(e.name);
            tab.setView(formPane);
            tabModel.add(tab);
            if (i === 0) {
                tabModel.sm().ss(tab);
            }
        });

        dialog.setConfig({
            title: '事件处理',
            content: tabView,
            width: 800,
            height: 600,
            closable: true,
            buttons: [
                {
                    label: '确定',
                    action: function() {
                        editor.dm.beginTransaction();
                        tabModel.each(function(tab) {
                            var content = tab.getView().v('content'),
                                func;
                            if (content) {
                                func = hteditor.parseFunction('function(event, data, view) {' + content + '}');
                            }
                            var selection = editor.sm.getSelection();
                            selection.each(function(data) {
                                data.s(tab._eventName, func);
                            });

                        });
                        editor.dm.endTransaction();
                        dialog.hide();
                    }
                },{
                    label: '取消',
                    action: function() {
                        dialog.hide();
                    }
                }
            ]
        });
        var checkBox = new ht.widget.CheckBox();
        checkBox.onValueChanged = function(oldValue, newValue) {
            var selection = editor.sm.getSelection();
            editor.dm.beginTransaction();
            selection.each(function(data) {
                data.s('interactive', newValue);
            });
            editor.dm.endTransaction();
        }
        inspector.addRow([
            {
                button: {
                    label: '事件处理',
                    background: '#fff',
                    labelColor: '#111',
                    hoverColor: '#333',
                    activeLabelColor: 'blue',
                    onClicked: function() {
                        tabModel.each(function(tab) {
                            var funcStr = hteditor.stringifyFunction(editor.ld.s(tab._eventName));
                            if (funcStr) {
                                funcStr = funcStr.replace('function(event, data, view) {', '');
                                funcStr = funcStr.replace(/\}$/, '');
                            }
                            tab.getView().v('content', funcStr || '');
                        });
                        dialog.show();
                    }
                },
            }, {
                element: checkBox
            }
        ], [0.1, 30]);

        inspector.addUpdateHandler(function(){
            if (editor.ld) {
                checkBox.setValue(editor.ld.s('interactive'));
            }
        });
    }
})();
