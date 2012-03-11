var show_link_form_link;
function show_link_form(link) {
    var f = $('#link_form');
    f.show();
    var c = link.center();
    f.css('top', c.y + 'px');
    f.css('left', c.x + 'px');
    $('#link_form_link_label').val(link.label());
    $('#link_form_link_id').html(link.get('_id'));
    $('#link_form_from_name').html(link.get('from_node').get('name'));
    $('#link_form_to_name').html(link.get('to_node').get('name'));
    $('#link_form_style').val(link.get('style'));
    show_link_form_link = link;
}

function update_show_link_form() {
    show_link_form_link.set('manual_label', $('#link_form_link_label').val());
    show_link_form_link.set('style', parseInt($('#link_form_style').val()));
    var c = $('#lfr');
    // console.log('checked value: ' , c.is(':checked'), c);
    if (c.is(':checked')) {
        var to_node = show_link_form_link.get('to_node');
        var from_node = show_link_form_link.get('from_node');
        show_link_form_link.set('to_node', from_node);
        show_link_form_link.set('from_node', to_node);
    }

    var f = $('#link_form');
    f.hide();
}

flowgraph.sprites.Link = function () {

    var link_id = 0;
    var CENTER_RAD = 15
    var stack_order = 0;

    var Link = Backbone.Model.extend({
        defaults:{

            ARROW_SIZE:12,

            manual_label:'',
            label_draw_props:{
                fill:'rgb(102, 102, 102)',
                font:'8pt, sans-serif, bold',
                base:'bottom',
                align:'center'
            },

            type:'link',

            style:0,

            line_props:{stroke:{
                width:2,
                fill:'rgb(102, 102, 102)'
            }},

            line_weak_props:{
                stroke:{
                    width:1,
                    fill:'rgb(204, 204, 204)'
                }
            },

            line_over_props:{stroke:{
                width:3,
                fill:'rgb(255, 0, 0)'
            }},

            arrowhead_draw_props:{
                stroke:{
                    width:1,
                    fill:'rgb(0, 0, 0)',
                    join:'miter'
                },
                fill:'rgb(128, 128, 128)'
            },

            arrowhead_draw_weak_props:{
                fill:'rgb(255, 255, 255)'
            },

            type:'link'
        },

        idAttribute:"_id",

        initialize:function () {
            if (!this.get('_id')) {
                this.set('_id', link_id++);
            }
            if (!this.get('stack_order')) {
                this.set('stack_order', ++stack_order);
            }
        },

        _toString:_.template('LINK id <%= _id %> (<%= label %>), style <%= style %> from <%= from_node_name %>' +
            'to <%= to_node_name %>)'),

        toString:function () {
            return this._toString(this.toJSON());
        },

        equals: function(l){
            return l.get('_id') == this.get('_id');
        },

        toJSON:function () {
            return {
                label:this.label(),
                _id:this.get('_id'),
                from_node: parseInt(this.get('from_node').get('_id')),
                from_node_name:this.from_node_name(),
                to_node_name:this.to_node_name(),
                style:this.get('style'),
                to_node:parseInt(this.get('to_node').get('_id'))
            };
        },

        from_node_name:function () {
            return this.get('from_node').get('name');
        },

        to_node_name:function () {
            return this.get('to_node').get('name');
        },

        label:function () {
            var label = this.get('manual_label');
            if (label) {
                return label;
            }
            var out = '';
            var join = ' to ';
            switch (this.get('style')) {
                case Link.BOTH_WAYS_WEAK:
                    join = ' <--> ';
                    break;
                case Link.ONE_WAY_WEAK:
                    join = ' <--> ';
                    break;
            }

            if (this.get('from_node')) {

                out += this.get('from_node').get('name');

                if (this.get('to_node')) {
                    out += join + this.get('to_node').get('name');
                }
            } else if (this.get('to_node')) {
                out += this.get('to_node').get('name');
            }
            return out;
        },

        draw:function (ctx) {
            if (!(this.get('from_node') && this.get('to_node'))) {
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

            a = flowgraph.util.Point.snap_angle(a, Math.PI / 8);

            if ((a >= Math.PI)) {
                a -= Math.PI;
            }

            ctx.rotate(a - Math.PI / 2);

            flowgraph.draw.text(ctx, this.label(), [0, 0], this.get('label_draw_props'));

            ctx.restore();
        },

        draw_lines:function (ctx) {

            var line_props = {};
            _.extend(line_props, this.get('line_props'));
            if (this.mouse_over()) {
                _.extend(line_props, this.get('line_over_props'));
            }


            switch (this.get('style')) {
                case Link.BOTH_WAYS_WEAK:
                    _.extend(line_props, this.get('line_weak_props'));
                    break;
                case Link.ONE_WAY_WEAK:
                    _.extend(line_props, this.get('line_weak_props'));
                    break;
            }

            var p1 = this.start_point();
            var p2 = this.end_point();
            var a = p2.rel_angle(p1);

            var path = p1.vector(a + Math.PI, this.get('ARROW_SIZE'), true).to_a().concat(p2.vector(a, this.get('ARROW_SIZE'), true).to_a());
            flowgraph.draw.line(ctx, path, line_props);
        },

        connects:function (n1, n2) {
            if (this.get('from_node').equals(n1) && this.get('to_node').equals(n2)) {
                return true;

            } else if (this.get('from_node').equals(n2) && this.get('to_node').equals(n1)) {
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
            ctx.lineTo(-this.get('ARROW_SIZE'), -this.get('ARROW_SIZE') / 2);
            ctx.lineTo(-this.get('ARROW_SIZE'), this.get('ARROW_SIZE') / 2);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fill();
            var props = {};
            _.extend(props, this.get('arrowhead_draw_props'));

            switch (this.get('style')) {
                case Link.BOTH_WAYS_WEAK:
                    _.extend(props, this.get('arrowhead_draw_weak_props'));
                    break;
                case Link.ONE_WAY_WEAK:
                    _.extend(props, this.get('arrowhead_draw_weak_props'));
                    break;
            }

            flowgraph.draw.paint(ctx, props, true);
            ctx.restore();
        },

        draw_arrowheads:function (ctx) {
            var p1 = this.start_point();
            var p2 = this.end_point();

            var a = p2.rel_angle(p1);

            var p1v = p1.vector(a + Math.PI, this.get('ARROW_SIZE'), true);
            var p2v = p2.vector(a, this.get('ARROW_SIZE'), true);


            var arrow_style = {stroke:{width:4, fill:'rgb(255, 0, 0)'}};
            // flowgraph.draw.line(ctx, p1.to_a().concat(p1v.to_a()), arrow_style);
            // flowgraph.draw.line(ctx, p2.to_a().concat(p2v.to_a()), arrow_style);

            this._arrowhead(ctx, p1v, p2v);

            switch (this.get('style')) {
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
            return (this.center().dist(flowgraph.mouse.left, flowgraph.mouse.top)) <= CENTER_RAD;
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
        start_point:function () {
            if (!(this.get('from_node') && this.get('to_node'))) {
                return;
            }
            var fc = this.get('from_node').center();
            var tc = this.get('to_node').center();
            var a = fc.ra_nsew(tc);

            var w = (this.get('from_node').get('width') / 2);
            var h = (this.get('from_node').get('height') / 2);
            var p = new flowgraph.util.Point(Math.cos(a) * w,
                Math.sin(a) * h);

            return p.add(fc);
        },

        end_point:function () {

            if (!(this.get('from_node') && this.get('to_node'))) {
                return;
            }
            var fc = this.get('from_node').center();
            var tc = this.get('to_node').center();
            var a = tc.ra_nsew(fc);

            var w = (this.get('to_node').get('width') / 2);
            var h = (this.get('to_node').get('height') / 2);

            var p = new flowgraph.util.Point(Math.cos(a) * w,
                Math.sin(a) * h);

            return p.add(tc);
        }
    });

    Link.ONE_WAY = 0;
    Link.BOTH_WAYS = 10;
    Link.ONE_WAY_WEAK = 20;
    Link.BOTH_WAYS_WEAK = 30;

    var Link_model = Backbone.Collection.extend({
        model:Link
    });

    flowgraph.collections.links = new Link_model();

    return Link;
}()