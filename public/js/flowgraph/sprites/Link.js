flowgraph.sprites.Link = function () {
    var link_id = 0;
    var Link = function (from_node, to_node, id) {
        this.from_node = from_node;
        this.to_node = to_node;
        this.id = id | ++link_id;
    }

    Link.prototype = {
        draw: function(ctx){
            var line_props = {stroke: {
                width: 3,
                fill: 'rgb(204, 204, 204)'
            }};

            var path = this.from_node.pa().concat(this.to_node.pa());
            flowgraph.draw.line(ctx, path, line_props);
        },

        mouse_over: function(){
            return false;
        }
    }

    return Link;
}()