flowgraph.init_events.push(function () {

    var selected_node;

    function _select_move() {
        var sprites = flowgraph.layers.get('drawing').items();

        selected_node.selected = false;
        selected_node = null;

        sprites.forEach(function (sprite) {
            if (sprite.mouse_over()) {
                if (selected_node) {
                    selected_node.selected = false;
                    selected_node = null;
                }
                selected_node = sprite;
                selected_node.selected = true;
            } else {
                sprite.selected = false;
            }
        });
        return true;
    }

    function _select_click() {
        if (selected_node) {
            selected_node.mouse_click();
            return false;
        } else {
            return true;
        }

    }

    function _select_node() {
        flowgraph.mouse.events._on_move = _select_move;

        flowgraph.mouse.events._on_click = _select_click;
    }

    function _selected_node_reset() {
        if (selected_node) {
            selected_node.selected = false;
        }
        selected_node = null;
    }

    var new_node;

    function _new_node() {
        if (new_node) {
            console.log('new node exists - skipping');
            return;
        }
        flowgraph.mode = 'new_node';

        new_node = new flowgraph.sprites.Item({});

        flowgraph.layers.get('overlay').sprites.add(new_node);
        flowgraph.mouse.events._on_move = function () {
            new_node.top = flowgraph.mouse.snap_top(50);
            new_node.left = flowgraph.mouse.snap_left(50);
            return true;
        }

        flowgraph.mouse.events._on_click = _node_click;
    }

    function _node_click() {
        if (flowgraph.mouse.left < 100) {
            return true;
        }
        flowgraph.mouse.events._on_move = flowgraph.mouse.events._on_click = false;
        flowgraph.layers.get('overlay').sprites.remove(new_node);
        new_node.new = false;
        flowgraph.layers.get('drawing').sprites.add(new_node);
        new_node = null;
        var toolbar = flowgraph.get_layer_item('tools', 'toolbar');
        toolbar.select_tool('select');

        console.log('new node set to null');
        return false;
    }

    function _new_node_reset() {
        flowgraph.mode = '';
        console.log('resetting new node');
        flowgraph.mouse.events._on_move = flowgraph.mouse.events._on_click = false;
        flowgraph.layers.get('overlay').sprites.remove(new_node);
        new_node = null;
    }

    var toolbar = new flowgraph.sprites.Toolbar({
        type:'toolbar',
        image:{src:'http://localhost:5103/img/toolbar.png'},
        tiles:[
            {id:'new_node', name:'New Node', activate:_new_node, reset:_new_node_reset},
            {id:'new_text', name:'New Text'},
            {id:'movie', name:'Movie', activate:_select_node},
            {id:'connect', name:'Connect', activate:_select_node},
            {id:'erase', name:'Erase', activate:_select_node},
            {id:'select', name:'Select', activate:_select_node, reset:_selected_node_reset}
        ],
        top:0,
        left:0,
        id:'toolbar',
        tile:{
            width:40,
            height:40,
            dir:'v'
        }
    });
    flowgraph.layers.get('tools').sprites.add(toolbar);

});