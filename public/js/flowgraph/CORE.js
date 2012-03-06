var flowgraph = {

    width:800,
    height:600,

    init_events:[],

    rect:{width:40, height:20,
        fillStyle:'rgba(230, 240, 255, 1.0)',
        moving_fillStyle:'rgba(230, 240, 255, 0.25)'},

    draw_rect_at_mouse:function () {

    },

    sprites:{},

    model:{
        nodes:[],

        links:[]
    },

    get_layer_item:function (layer, id) {
        var l = this.layers.get(layer);
        if (!l){
            return false;
        } else {
            return l.get(id);
        }
    },

    init:function (div_id) {
        flowgraph.canvas = document.getElementById(div_id);
        flowgraph.jcanvas = $('#' + div_id);
        flowgraph.ctx = flowgraph.canvas.getContext('2d');
        flowgraph.jcanvas.mousemove(flowgraph.mouse.events.move);
        flowgraph.jcanvas.click(flowgraph.mouse.events.click);

        var drawing_layer = new flowgraph.Layer('drawing');
        drawing_layer.sprites._on_add = function () {
            drawing_layer.sprites.items().forEach(function (sprite, i) {
                sprite.layer_index = i;
            })
        }
        flowgraph.layers = new flowgraph.Stack('layers');
        flowgraph.layers.add(new flowgraph.Layer('tools'));
        flowgraph.layers.add(new flowgraph.Layer('overlay'));
        flowgraph.layers.add(new flowgraph.Layer('links'));
        flowgraph.layers.add(new flowgraph.Layer('bg'));
        flowgraph.layers.add(drawing_layer);

        flowgraph.init_events.forEach(function (f) {
            f()
        });

        flowgraph.draw.init();
    }
};

