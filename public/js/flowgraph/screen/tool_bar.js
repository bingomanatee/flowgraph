flowgraph.init_events.push(function () {

    /* ***************** SELECT NODE *********************** */

    var selected_node;

    function _select_move() {
        var sprites = flowgraph.layers.get('drawing').items();
        _deselect_node();

        sprites.forEach(function (sprite) {
            if (sprite.mouse_over()) {
                _deselect_node();
                selected_node = sprite;
                selected_node.selected = true;
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
        flowgraph.mode = 'select';

        flowgraph.mouse.events._on_move = _select_move;
        flowgraph.mouse.events._on_click = _select_click;
    }

    function _deselect_node() {
        if (selected_node) {
            selected_node.selected = false;
        }
        selected_node = null;
    }
    
    function _selected_node_reset(){
    	_deselect_node();
    	flowgraph.mode = '';
        flowgraph.mouse.events._on_move = null;
        flowgraph.mouse.events._on_click = null;
    }

    /* **************** MOVING NODE *************** */
    
    function _deselect_moving_node(){
    	moving_node.moving = false;
        moving_node = null;
    }

    function _move_node_reset() {
    	flowgraph.mode = '';
        console.log('resetting move node');
        flowgraph.mouse.events._on_move = flowgraph.mouse.events._on_click = false;
        flowgraph.layers.get('overlay').sprites.remove(new_node);
        if (moving_node){
        	_deselect_moving_node();
        }
    }

    var moving_node = null;

    function _move_node_click() {
        if (moving_node) {
            _deselect_moving_node();
        } else if (selected_node){
        	moving_node = selected_node;
        	_deselect_node();
        	moving_node.moving = true;
        }
    }

    function _move_node_move() {
        if (moving_node) {
        	moving_node.top = flowgraph.mouse.snap_top(50);
        	moving_node.left = flowgraph.mouse.snap_left(50);
        	return true;
        } else {
       		return _select_move();
        }
    }

    function _move_node() {
        flowgraph.mode = 'move_node';
        flowgraph.mouse.events._on_move = _move_node_move;
        flowgraph.mouse.events._on_click = _move_node_click;
    }

    /* ************** NEW NODE **************** */

    var new_node;

    function _new_node_move() {
        new_node.top = flowgraph.mouse.snap_top(50);
        new_node.left = flowgraph.mouse.snap_left(50);
        return true;
    }

    function _new_node() {
        if (new_node) {
            console.log('new node exists - skipping');
            return;
        }
        flowgraph.mode = 'new_node';

        new_node = new flowgraph.sprites.Item({});
        flowgraph.layers.get('overlay').sprites.add(new_node);
        flowgraph.mouse.events._on_move = _new_node_move;

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

    /* ***************** CONNECT **************** */

    var new_link = new flowgraph.sprites.Link();

    function _link_node_click(){
        return true;
    }

    function _link_node() {
        flowgraph.mode = 'new_node';

        flowgraph.mouse.events._on_move = null;
        flowgraph.mouse.events._on_click = _link_node_click;
    }

    /* ***************** TOOLBAR **************** */

    var toolbar = new flowgraph.sprites.Toolbar({
        type:'toolbar',
        image:{src:'http://localhost:5103/img/toolbar.png'},
        tiles:[
            {id:'new_node', name:'New Node', activate:_new_node, reset:_new_node_reset},
            {id:'new_text', name:'New Text'},
            {id:'movie', name:'Movie', activate:_move_node, reset:_move_node_reset},
            {id:'connect', name:'Connect', activate:_link_node},
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