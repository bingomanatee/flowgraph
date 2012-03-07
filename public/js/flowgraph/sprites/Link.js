flowgraph.sprites.Link = function () {
    var link_id = 0;
    var Link = function (from_node, to_node, id, props) {

        this.id = id | ++link_id;

        this.label_draw_props = {
            fill:'rgb(102, 102, 102)',
            font:'8pt, sans-serif, bold',
            base:'bottom',
            align:'center'
        };

        this.line_props = {stroke:{
            width:2,
            fill:'rgb(204, 204, 204)'
        }};


        this.line_over_props = {stroke:{
            width:3,
            fill:'rgb(255, 0, 0)'
        }};

        if (props) {
            _.extend(props);
        }
        this.from_node = from_node;
        this.to_node = to_node;

        this.type = 'link';
    }

    Link.prototype = {
        type:'link',

        label:function () {
            var out = '';
            if (this.from_node) {

                out += this.from_node.name;

                if (this.to_node) {
                    out += ' to ' + this.to_node.name;
                }
            } else if (this.to_node) {
                out += this.to_node.name;
            }
            return out;
        },

        toString: function(){
            return this.label();
        },

        draw:function (ctx) {
            if (!(this.from_node && this.to_node)) {
                return;
            }

            var line_props = {};
            _.extend(line_props, this.line_props);
            if (this.mouse_over()){
                _.extend(line_props, this.line_over_props);
            }

            var path = this.start_point().to_a().concat(this.end_point(true).to_a());
            flowgraph.draw.line(ctx, path, line_props);

            var p1 = this.end_point().add(-this.ARROW_SIZE, -this.ARROW_SIZE);
            var p2 = this.end_point().add(this.ARROW_SIZE, this.ARROW_SIZE);

            path = p1.to_a().concat(this.end_point().to_a().concat(p2.to_a()));
            flowgraph.draw.line(ctx, path, line_props);
            console.log('arrowhead: ' + path.join(', '));

            p1 = this.end_point().add(-this.ARROW_SIZE, this.ARROW_SIZE);
            p2 = this.end_point().add(this.ARROW_SIZE, -this.ARROW_SIZE);

            path = p1.to_a().concat(this.end_point().to_a().concat(p2.to_a()));
            flowgraph.draw.line(ctx, path, line_props);
            console.log('arrowhead: ' + path.join(', '));

            flowgraph.draw.text(ctx, this.label(), this.center().to_a(), this.label_draw_props);
        },

        center:function () {
            return this.start_point().avg(this.end_point());
        },

        mouse_over:function () {
            return (this.center().dist(flowgraph.mouse.left, flowgraph.mouse.top)) <= this.CENTER_RAD;
        },

        ARROW_SIZE:8,
        CENTER_RAD:15,

        start_point:function (os) {
            if (!(this.from_node && this.to_node)) {
                return;
            }
            var fc = this.from_node.center();
            var tc = this.to_node.center();
            //    console.log('link from ', fc.toString(), 'to', tc.toString());
            var a = fc.ra_nsew(tc);
            var w = (os ? this.ARROW_SIZE : 0) + (this.from_node.width / 2);
            var h = (os ? this.ARROW_SIZE : 0) + (this.from_node.height / 2);
            var p = new flowgraph.util.Point(Math.cos(a) * w,
                Math.sin(a) * h);

            return p.add(fc);
        },

        end_point:function (os) {

            if (!(this.from_node && this.to_node)) {
                return;
            }
            var fc = this.from_node.center();
            var tc = this.to_node.center();
            var a = tc.ra_nsew(fc);

            var w = (os ? this.ARROW_SIZE : 0) + (this.from_node.width / 2);
            var h = (os ? this.ARROW_SIZE : 0) + (this.from_node.height / 2);

            var p = new flowgraph.util.Point(Math.cos(a) * w,
                Math.sin(a) * h);

            return p.add(tc);
        }
    }

    return Link;
}()