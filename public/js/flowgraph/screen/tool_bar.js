/* ************ TOOL BAR ******** */
/* note - this is an instance of the Toolbar class; 
 potentially confusing, but there you have it.
 */

flowgraph.init_events.push(function () {

    var over_action;
    var selected_node;
    var selected_line;
    var moving_action;
    var new_action;
    var over_link;
    var last_selected_node;

    function show_status() {
        $('#new_item_info').html(new_action ? new_action.toString() : '');
        $('#selected_item_info').html(selected_node ? selected_node.toString() : '');
        $('#moving_item_info').html(moving_action ? moving_action.toString() : '');
        $('#over_item_info').html(over_action ? over_action.toString() : '');
        $('#over_link_info').html(over_link ? over_link.toString() : '');
        $('#fg_mode').html(flowgraph.mode ? flowgraph.mode : '&nbsp;');
    }

    function _sod(action){
                return action.get('sort_order') * -1;
            }
    /* ***************** SELECT NODE *********************** */

    function _select_move() {
        show_status()
        var actions = flowgraph.get_actions();
        _de_over_action();
        _de_over_link();

        actions.forEach(function (action) {
            if (action.mouse_over()) {
                _de_over_action();
                over_action = action;
                over_action.set('is_over', true);
            }
        });

        if (!over_action) {
            var links = flowgraph.collections.links.sortBy(function(link){
                return link.get('sort_order') * -1;
            });
            links.forEach(function (link) {
                if (link.mouse_over()) {
                    _de_over_link();
                    over_link = link;
                    over_link.set('is_over', true);
                }
            });
        }
        return true;
    }

    function _select_click() {
        if (over_action) {
            over_action.mouse_click();
            _select_a_node(over_action);
            return false;
        } else if (over_link) {
            _select_a_link(over_link);
            over_link.mouse_click();
            return false;
        } else {
            return true;
        }

    }

    function _select_a_link(line) {
        _deselect_node();
        _deselect_link();
        selected_line = line;
        line.set('is_selected', true);
    }

    function _select_a_node(node) {
        _deselect_node();
        _deselect_link();
        selected_node = node;
        node.set('is_selected', true);
    }

    function _select_mode_init() {
        flowgraph.mode = 'select';

        flowgraph.mouse.events._on_move = _select_move;
        flowgraph.mouse.events._on_click = _select_click;
    }

    function _deselect_node() {
        if (selected_node) {
            selected_node.set('is_selected', false);
        }
        selected_node = null;
    }

    function _deselect_link(line) {
        if (selected_line) {
            selected_line.set('is_selected', false);
        }
        selected_line = null;
    }

    function _de_over_action() {
        if (over_action) {
            over_action.set('is_over', false);
        }
        over_action = null;
    }

    function _de_over_link() {
        if (over_link) {
            over_link.set('is_over', false);
        }
        over_link = null;
    }

    function _selected_node_reset() {
        flowgraph.mode = '';
        flowgraph.mouse.events._on_move = null;
        flowgraph.mouse.events._on_click = null;
    }

    /* **************** MOVING NODE *************** */

    function _deselect_moving_action() {
        moving_action.moving = false;
        moving_action = null;
    }

    function _move_node_reset() {
        flowgraph.mode = '';
        console.log('resetting move node');
        flowgraph.mouse.events._on_move = flowgraph.mouse.events._on_click = false;
        if (moving_action) {
            _deselect_moving_action();
        }
    }

    function _move_node_click() {
        if (moving_action) {
            _select_a_node(moving_action);
            _deselect_moving_action();
            return true;
        } else if (over_action) {
            moving_action = over_action;
            moving_action.moving = true;
            return false;
        } else {
            return true;
        }
    }

    function _move_node_move() {
        show_status();

        if (moving_action) {
            moving_action.set('top', flowgraph.mouse.snap_top(50));
            moving_action.set('left', flowgraph.mouse.snap_left(50));
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

    function _new_action_move() {
        show_status();

        new_action.set('top', flowgraph.mouse.snap_top(50));
        new_action.set('left', flowgraph.mouse.snap_left(50));
        return true;
    }

    var from_node;

    function _new_action() {
        if (new_action) {
            console.log('new node exists - skipping');
            return;
        }
        flowgraph.mode = 'new_action';

        new_action = new flowgraph.sprites.Action({is_new: true, is_selected: true});
        flowgraph.collections.actions.add(new_action);

        flowgraph.mouse.events._on_move = _new_action_move;
        flowgraph.mouse.events._on_click = _new_action_click;
        from_node = selected_node;
    }

    function _new_action_click() {
        if (flowgraph.mouse.left < 100) {
            return true;
        }
        flowgraph.mouse.events._on_move = flowgraph.mouse.events._on_click = false;

        new_action.set('is_new', false);
        _select_a_node(new_action);

        if (from_node && new_action) {
            var link = new flowgraph.sprites.Link({from_node: from_node, to_node: new_action});
            flowgraph.collections.links.add(link);
        }
        new_action = null;
        var toolbar = flowgraph.get_layer_item('tools', 'toolbar');

        toolbar.select_tool('select');

        console.log('is_new node set to null');
        return false;
    }

    function _new_action_reset() {
        flowgraph.mode = '';
        flowgraph.mouse.events._on_move = flowgraph.mouse.events._on_click = false;
        if (new_action){
            new_action.set('is_new', false);
            new_action = null;
        }
    }

    /* ***************** CONNECT **************** */

    var new_link = new flowgraph.sprites.Link();

    function _link_node_click() {
        if (over_action) {
            last_selected_node = selected_node;
            over_action.mouse_click();
            _select_a_node(over_action);
        } else {
            return true;
        }

        if (!(last_selected_node.equals(selected_node))) {
            if (last_selected_node && selected_node) {

                if (!flowgraph.util.link_exists(last_selected_node, selected_node)) {
                    var link = new flowgraph.sprites.Link({from_node: last_selected_node, to_node: selected_node});
                    flowgraph.collections.links.add(link);
                }
                last_selected_node = selected_node;
            }
        }
    }

    function _link_move() {
        show_status()
        var actions = flowgraph.get_actions();
        _de_over_action();

        actions.forEach(function (sprite) {
            if (sprite.mouse_over()) {
                _de_over_action();
                over_action = sprite;
                over_action.set('is_over', true);
            }
        });

        return true;
    }

    function _link_node() {
        flowgraph.mode = 'new_action';

        flowgraph.mouse.events._on_move = _link_move;
        flowgraph.mouse.events._on_click = _link_node_click;
    }

    /* ***************** TOOLBAR **************** */

    var toolbar = new flowgraph.sprites.Toolbar({
        type:'toolbar',
        image:{src:'http://localhost:5103/img/toolbar.png'},
        tiles:[
            {_id:'new_action', name:'New Node', activate:_new_action, reset:_new_action_reset},
            {_id:'new_text', name:'New Text'},
            {_id:'movie', name:'Movie', activate:_move_node, reset:_move_node_reset},
            {_id:'connect', name:'Connect', activate:_link_node},
            {_id:'erase', name:'Erase'},
            {_id:'select', name:'Select', activate:_select_mode_init, reset:_selected_node_reset}
        ],
        top:0,
        left:0,
        _id:'toolbar',
        tile:{
            width:40,
            height:40,
            dir:'v'
        }
    });
    flowgraph.layers.tools.push(toolbar);

});