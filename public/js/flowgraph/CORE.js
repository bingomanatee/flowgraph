var flowgraph = {

    width:800,
    height:600,

    init_events: [],

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

    init:function (div_id) {
        flowgraph.canvas = document.getElementById(div_id);
        flowgraph.jcanvas = $('#' + div_id);
        flowgraph.ctx = flowgraph.canvas.getContext('2d');
        flowgraph.jcanvas.mousemove(flowgraph.mouse.events.move);
        flowgraph.jcanvas.click(flowgraph.mouse.events.click);


        flowgraph.layers = new flowgraph.Stack('layers');
        flowgraph.layers.add(new flowgraph.Layer('bg'), 30);
        flowgraph.layers.add(new flowgraph.Layer('drawing'), 10);
        flowgraph.layers.add(new flowgraph.Layer('overlay'), 5);
        flowgraph.layers.add(new flowgraph.Layer('tools'), 0);

        flowgraph.init_events.forEach(function(f){f()});

        flowgraph.draw.init();
    }
};

