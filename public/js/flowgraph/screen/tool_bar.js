flowgraph.init_events.push(function () {

    function _select_node() {
        flowgraph.mouse._on_move = function () {
            return true;
        };

        flowgraph.mouse._on_click = function () {
            return true;
        }
    }

    var new_node;

    function _new_node() {
        if (new_node) {
            console.log('new node exists - skipping');
            return;
        }
        new_node = new flowgraph.sprites.Item({name:'new node'});

        flowgraph.layers.get('overlay').sprites.add(new_node);
        flowgraph.mouse.events._on_move = function () {
            new_node.top = flowgraph.mouse.snap_top(50);
            new_node.left = flowgraph.mouse.snap_left(50);
            return true;
        }

        setTimeout(function () {
            flowgraph.mouse.events._on_click = function () {
                if (flowgraph.mouse.left < 100){
                    return true;
                }
                flowgraph.mouse.events._on_move = flowgraph.mouse.events._on_click = false;
                flowgraph.layers.get('overlay').sprites.remove(new_node);
                new_node.new = false;
                flowgraph.layers.get('drawing').sprites.add(new_node);
                new_node = null;
                console.log('new node set to null');
                return false;
            }
        }, 500);
    }

    function _new_node_reset(){
        console.log('resetting new node');
        flowgraph.mouse.events._on_move = flowgraph.mouse.events._on_click = false;
        flowgraph.layers.get('overlay').sprites.remove(new_node);
        new_node = null;
    }

    var toolbar = new flowgraph.sprites.Toolbar({
        type:'toolbar',
        image:{src:'http://localhost:5103/img/toolbar.png'},
        tiles:[
            {name:'New Node', _on_click:_new_node, _on_reset: _new_node_reset},
            {name:'New Text', _on_click:_select_node},
            {name:'Move', _on_click:_select_node},
            {name:'connect', _on_click:_select_node},
            {name:'Erase', _on_click:_select_node},
            {name:'Select', _on_click:_select_node}
        ],
        top:0,
        left:0,
        name:'toolbar',
        tile:{
            width:40,
            height:40,
            dir:'v'
        }
    });
    flowgraph.layers.get('bg').sprites.add(toolbar);

});