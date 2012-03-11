var flowgraph = function () {

    function _sod(item){
        if (item instanceof Backbone.Model){
            return item.get('sort_order') * -1;
        } else if (item.hasOwnProperty('sort_order')){
            return item.sort_order;
        } else {
            return 0;
        }
    }

    return {

        width:800,
        height:600,

        init_events:[],

        rect:{width:40, height:20,
            fillStyle:'rgba(230, 240, 255, 1.0)',
            moving_fillStyle:'rgba(230, 240, 255, 0.25)'},

        draw_rect_at_mouse:function () {

        },

        sprites:{},

        util:{},

        collections:{},

        layers:{},

        layer:function (name) {
            return flowgraph.layers[name];
        },

        layer_items:function () {

            var out = flowgraph.layers.tools.slice(0);
            out = out.concat(flowgraph.collections.actions.sortBy(_sod));
            out = out.concat(flowgraph.collections.links.sortBy(_sod))
            out = out.concat(flowgraph.layers.bg);

            return out;
        },

        layer_items_seek:function (test) {
            var out;
            var items;

            items = flowgraph.layers.tools.slice(0);
            for (var i = 0; i < items.length; ++i) {
                if (out = test(items[i])) {
                    return out;
                }
            }

            items = (flowgraph.collections.actions.sortBy(_sod));
            for (var i = 0; i < items.length; ++i) {
                if (out = test(items[i])) {
                    return out;
                }
            }
            items = (flowgraph.collections.links.sortBy(_sod))
            for (var i = 0; i < items.length; ++i) {
                if (out = test(items[i])) {
                    return out;
                }
            }
            items = (flowgraph.layers.bg);
            for (var i = 0; i < items.length; ++i) {
                if (out = test(items[i])) {
                    return out;
                }
            }

            return false;
        },

        get_layer_item:function (layer, id) {
            var l = this.layers[layer];
            if (!l) {
                return false;
            } else {
                var opts = _.filter(l, function (item) {
                    return item._id == id;
                })
                return opts[0];
            }
        },

        init:function (div_id) {
            var li = setInterval(function () {
                if (!flowgraph.Layer && flowgraph.Action) return;
                flowgraph.canvas = document.getElementById(div_id);
                flowgraph.jcanvas = $('#' + div_id);
                flowgraph.ctx = flowgraph.canvas.getContext('2d');
                flowgraph.jcanvas.mousemove(flowgraph.mouse.events.move);
                flowgraph.jcanvas.click(flowgraph.mouse.events.click);

                flowgraph.layers.tools = [];
                flowgraph.layers.bg = [];

                flowgraph.init_events.forEach(function (f) {
                    f()
                });

                flowgraph.draw.init();
                clearInterval(li);
            }, 500);
        },

        save:function () {
            var data = {
                actions:flowgraph.collections.actions.toJSON(),
                links:flowgraph.collections.links.toJSON()
            };

            console.log('saving', JSON.stringify(data));

            $.post('/flowgraph/' + flowgraph.project_id, data, function (result) {
                flowgraph.on_save(result);
            }, 'JSON')
        },

        on_save:function (result) {
            $('#save_done').html('Data Saved');
            $('#save_done').show();

            setTimeout(function () {
                $('#save_done').hide();
            }, 5000);
        },

        get_actions: function(){
            return this.collections.actions.sortBy(_sod);
        },

        get_links: function(){
            return this.collections.links.sortBy(_sod);
        },

        get_tool: function(name){
            var out = false;
            flowgraph.layers.tools.forEach(function(t){
                if ( t._id == name){
                    out = t;
                }
            });

            return out;
        }
    };
} ();

