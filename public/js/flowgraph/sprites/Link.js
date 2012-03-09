var show_link_form_link;
function show_link_form(link) {
    var f = $('#link_form');
    f.show();
    var c = link.center();
    f.css('top', c.y + 'px');
    f.css('left', c.x + 'px');
    $('#link_form_link_label').val(link.label());
    $('#link_form_link_id').html(link.id);
    $('#link_form_from_name').html(link.from_node.name);
    $('#link_form_to_name').html(link.to_node.name);
    $('#link_form_style').val(link.style);
    show_link_form_link = link;
}

function update_show_link_form() {
    show_link_form_link.manual_label = $('#link_form_link_label').val();
    show_link_form_link.style = parseInt($('#link_form_style').val());
    var c = $('#lfr');
    // console.log('checked value: ' , c.is(':checked'), c);
    if (c.is(':checked')) {
        var old_from = show_link_form_link.from_node;
        show_link_form_link.from_node = show_link_form_link.to_node;
        show_link_form_link.to_node = old_from;
    }

    var f = $('#link_form');
    f.hide();
}

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
            fill:'rgb(102, 102, 102)'
        }};

        this.line_weak_props = {
            stroke:{
                width:1,
                fill:'rgb(204, 204, 204)'
            }
        }

        this.line_over_props = {stroke:{
            width:3,
            fill:'rgb(255, 0, 0)'
        }};

        this.arrowhead_draw_props = {
            stroke:{
                width:1,
                fill:'rgb(0, 0, 0)',
                join:'miter'
            },
            fill:'rgb(128, 128, 128)'
        };

        this.arrowhead_draw_weak_props = {
            fill:'rgb(255, 255, 255)'
        };


        if (props) {
            _.extend(props);
        }
        this.from_node = from_node;
        this.to_node = to_node;

        this.type = 'link';
    }

    Link.ONE_WAY = 0;
    Link.BOTH_WAYS = 10;
    Link.ONE_WAY_WEAK = 20;
    Link.BOTH_WAYS_WEAK = 30;

    Link.prototype = {

        _toString:_.template('LINK id <%= id %> (<%= manual_label %>), style <%= style %> from <%= from_node.to_s() %> to <%= to_node.to_s() %>'),

        to_s:function () {
            var out = this._toString(this);
            //   console.log('link to string: ', out);
            return out;
        },

        type:'link',
        style:Link.ONE_WAY,

        manual_label:'',

        label:function () {
            if (this.manual_label) {
                return this.manual_label;
            }
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

        toString:function () {
            return this.label();
        },

        draw:function (ctx) {
            if (!(this.from_node && this.to_node)) {
                return;
            }

            this.draw_lines(ctx);

            this.draw_arrowheads(ctx);

            this.draw_label(ctx);
        },

        draw_label:function (ctx) {
            var c = this.center();
            ctx.save();
            ctx.translate(c.x, c.y);
            var a = this.start_point().rel_angle(this.end_point());
            if ((a > Math.PI)) {
                a -= Math.PI;
            }
            ctx.rotate(a - Math.PI / 2);

            flowgraph.draw.text(ctx, this.label(), [0, 0], this.label_draw_props);

            ctx.restore();
        },

        draw_lines:function (ctx) {

            var line_props = {};
            _.extend(line_props, this.line_props);
            if (this.mouse_over()) {
                _.extend(line_props, this.line_over_props);
            }


            switch (this.style) {
                case Link.BOTH_WAYS_WEAK:
                    _.extend(line_props, this.line_weak_props);
                    break;
                case Link.ONE_WAY_WEAK:
                    _.extend(line_props, this.line_weak_props);
                    break;
            }

            var p1 = this.start_point();
            var p2 = this.end_point();
            var a = p2.rel_angle(p1);

            var path = p1.vector(a + Math.PI, this.ARROW_SIZE, true).to_a().concat(p2.vector(a, this.ARROW_SIZE, true).to_a());
            flowgraph.draw.line(ctx, path, line_props);
        },

        connects:function (n1, n2) {
            if (this.from_node.equals(n1) && this.to_node.equals(n2)) {
                return true;

            } else if (this.from_node.equals(n2) && this.to_node.equals(n1)) {
                return true;
            }

            return false;
        },

        _arrowhead:function (ctx, p1, p2) {
            var a = p2.rel_angle(p1);

            ctx.save();
            ctx.translate.apply(ctx, p2.to_a());
            ctx.rotate(a + Math.PI);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-this.ARROW_SIZE, -this.ARROW_SIZE / 2);
            ctx.lineTo(-this.ARROW_SIZE, this.ARROW_SIZE / 2);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fill();
            var props = {};
            _.extend(props, this.arrowhead_draw_props);

            switch (this.style) {
                case Link.BOTH_WAYS_WEAK:
                    _.extend(props, this.arrowhead_draw_weak_props);
                    break;
                case Link.ONE_WAY_WEAK:
                    _.extend(props, this.arrowhead_draw_weak_props);
                    break;
            }

            flowgraph.draw.paint(ctx, props, true);
            ctx.restore();
        },


        draw_arrowheads:function (ctx) {
            var p1 = this.start_point();
            var p2 = this.end_point();

            var a = p2.rel_angle(p1);

            var p1v = p1.vector(a + Math.PI, this.ARROW_SIZE, true);
            var p2v = p2.vector(a, this.ARROW_SIZE, true);


            var arrow_style = {stroke: {width: 4, fill: 'rgb(255, 0, 0)'}};
           // flowgraph.draw.line(ctx, p1.to_a().concat(p1v.to_a()), arrow_style);
           // flowgraph.draw.line(ctx, p2.to_a().concat(p2v.to_a()), arrow_style);

            this._arrowhead(ctx, p1v, p2v);

            switch (this.style) {
                case Link.BOTH_WAYS_WEAK:
                    this._arrowhead(ctx, p2v, p1v);
                    break;
                case Link.BOTH_WAYS:
                    this._arrowhead(ctx, p2v, p1v);
                    break;
            }
        },

        center:function () {
            return this.start_point().avg(this.end_point());
        },

        mouse_over:function () {
            return (this.center().dist(flowgraph.mouse.left, flowgraph.mouse.top)) <= this.CENTER_RAD;
        },

        mouse_click:function () {
            if (flowgraph.mode == 'select') {

                if (this.mouse_over()) {
                    console.log('showing link form');
                    show_link_form(this);
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        },

        ARROW_SIZE:12,
        CENTER_RAD:15,

        start_point:function () {
            if (!(this.from_node && this.to_node)) {
                return;
            }
            var fc = this.from_node.center();
            var tc = this.to_node.center();
            //    console.log('link from ', fc.toString(), 'to', tc.toString());
            var a = fc.ra_nsew(tc);

            var w = (this.from_node.width / 2);
            var h = (this.from_node.height / 2);
            var p = new flowgraph.util.Point(Math.cos(a) * w,
                Math.sin(a) * h);

            return p.add(fc);
        },

        end_point:function () {

            if (!(this.from_node && this.to_node)) {
                return;
            }
            var fc = this.from_node.center();
            var tc = this.to_node.center();
            var a = tc.ra_nsew(fc);

            var w = (this.to_node.width / 2);
            var h = (this.to_node.height / 2);

            var p = new flowgraph.util.Point(Math.cos(a) * w,
                Math.sin(a) * h);

            return p.add(tc);
        }
    }

    return Link;
}
    ()