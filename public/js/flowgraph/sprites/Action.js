var show_item_form_item;
function show_item_form(item) {
    var f = $('#item_form');
    f.show();
    f.css('top', item.get('top'));
    f.css('left', item.get('left'));
    $('#item_form_item_name').val(item.get('name'));
    $('#item_form_item_id').html(item.get('id'));
    $('#item_form_strength').val(item.get('strength'));
    show_item_form_item = item;
}

function update_show_item_form() {
    var name = $('#item_form_item_name').val();
    if (name) {
        show_item_form_item.set('name', name);
    }
    show_item_form_item.set_strength($('#item_form_strength').val());

    var f = $('#item_form');
    f.hide();
}

flowgraph.sprites.Action = function () {

    /* ********** STRENGTH RANGES **************** */

    var STRENGTH_MINOR = 'minor';
    var STRENGTH_NORMAL = 'normal';
    var STRENGTH_MAJOR = 'major';

    /* ************ DRAW PROPS ******************* */

    function _init_dashed_image(ctx) {
        dashed_image = new Image();
        dashed_image.onload = function () {

            var dashed_pattern = ctx.createPattern(dashed_image, 'repeat');
            _dashed.fill = dashed_pattern;
        };
        dashed_image.src = 'http://localhost:5103/js/flowgraph/sprites/dashed.png';
    }

    function _selected_blend(ctx, props) {
        var stops = [
            {stop:0, color:'rgb(255, 204, 102)'},
            {stop:0.25, color:'rgb(255, 102, 0)'},
            {stop:1, color:'rgb(0, 0, 0)'}
        ];

        var coords = [60, 40, 10, 60, 24, 100];

        return flowgraph.draw.grad(ctx, stops, coords, 'radial');
    }

    function _item_blend_hl(ctx, props) {
        var stops = [
            {stop:0.0, color:'rgba(255, 255, 255, 0.8)'},
            {stop:0.25, color:'rgba(255, 255, 255, 0.2)'},
            {stop:1, color:'rgba(255, 255, 255, 0.0)'}
        ];
        var coords = [60, 40, 10, 60, 24, 200];

        return flowgraph.draw.grad(ctx, stops, coords, 'radial');
    }

    function _item_blend(ctx, props) {
        var stops = [
            {stop:0.0, color:'#a69ddf'},
            {stop:0.6, color:'#ffffff'},
            {stop:0.6125, color:'#ebe8ff'},
            {stop:1, color:'#847eac'}
        ];

        var coords = [0, 0, 0, 60];

        return flowgraph.draw.grad(ctx, stops, coords, 'linear');
    }

    function _item_blend_alt(ctx, props) {
        var stops = [
            {stop:0.0, color:'#9999FF'},
            {stop:0.5, color:'#CCCCFF'},
            {stop:0.525, color:'#6666FF'},
            {stop:0.8, color:'#9999FF'}
        ];

        var coords = [80, -400, 400, 40, -400, 466];

        return flowgraph.draw.grad(ctx, stops, coords, 'radial');
    }

    var _dashed = {fill:'rgb(0,200,0)', width:2};

    /* ******************** DRAW PROPS OBJ ************* */

    var draw_props = {};

    draw_props[STRENGTH_MAJOR] = {
        fill:_item_blend,
        stroke_first:true,
        stroke:{
            style:'rgb(0, 0, 0)',
            width:2
        }
    };

    draw_props[STRENGTH_NORMAL] = {
        fill:_item_blend,
        stroke_first:true,
        stroke:{
            style:'rgb(0, 0, 0)',
            width:1
        }
    };

    draw_props[STRENGTH_MINOR] = {
        fill:'rgb(204, 204, 255)',
        stroke:{
            style:'rgb(0,0,0)',
            width:1
        }
    };

    draw_props['SELECTED'] = {
        fill: _selected_blend
    }

    draw_props['OVER'] = {
        stroke:{
            width:4,
            fill:'rgb(255, 102, 0)'
        }
    }

    draw_props['NEW'] = {
        fill:'rgba(255, 204, 0, 0.15)' ,
        stroke:_dashed
    };

    draw_props['MOVING'] = {
        stroke:{fill:_dashed}
    };


    draw_props['HL'] = {
        fill:_item_blend_hl
    };

    var dashed_image = null;

    var diamond_style = {stroke:{width:1, fill:'rgba(0,0,0, 0.5)'}, stroke_first:true, fill:'rgb(102, 255, 51)'};
    var diamond_offset = 12;
    var diamond_size = 6;
    var item_count = 0;

    var item_id = 1;

    function _draw(ctx) {
        var props = {};

        if (!dashed_image) {
            _init_dashed_image(ctx);
        }

        _.extend(props, this.draw_props(ctx));

        flowgraph.draw.roundrect(ctx, this.dims(), props);

        ctx.save();
        ctx.translate(this.get('left'), this.get('top'));
        this.draw_label(ctx);
        this.draw_diamond(ctx);
        ctx.restore();
        // this.draw_layer(ctx);
    }

    var Action = Backbone.Model.extend({
        type:'item',

        initialize:function () {
            if (!this.get('id')) {
                this.set('id', item_id++);
                this.set('name', item_id == 2 ? 'START' : 'Action ' + (item_id - 2));
            }
        },

        defaults:{
            top:0,
            left:0,
            width:120,
            height:75,
            strength:STRENGTH_NORMAL,

            name:'untitled',
            is_new:true,
            is_over:false,
            moving:false,

            label_draw_props:{
                fill:'rgb(0,0,0)',
                font:'10pt, sans-serif, bold',
                base:'bottom'
            },

            selected_draw_props:{
                fill:_selected_blend
            },

            type:'item'
        },

        _toString:_.template('ITEM id <%= id %> (<%= name %>, at <%= left %>, <%= top %>)'),

        toString:function () {
            var out = this._toString(this.toJSON());
            if (this.get('is_new')) {
                out += ' new ';
            }
            if (this.get('is_selected')) {
                out += ' sel ';
            }

            if (this.get('is_over')) {
                out += ' over ';
            }

            return out;
        },

        equals:function (item) {
            return item.id == this.id;
        },

        pa:function () {
            return [this.get('left') + this.get('width') / 2, this.get('top') + this.get('height') / 2];
        },

        set_strength:function (v) {
            v = parseInt(v);
            console.log('setting strength of', this.toString(), 'to', v);
            if (v <= -10) {
                // optional;
                this.set('strength', -10);
            } else if (v < 10) {
                //standard
                this.set('strength', 0);
            } else {
                // critical path
                this.set('strength', 10);
            }
        },

        center:function () {
            var out = new flowgraph.util.Point(this.get('left') + this.get('width') / 2, this.get('top') + this.get('height') / 2);
            //  console.log('center of ', this.get('name'), ':', out.toString());
            return out;
        },

        draw:_draw,

        label_pt:[10, 20],

        draw_label:function (ctx) {
            var txt_props = {};
            _.extend(txt_props, this.get('label_draw_props'));
            flowgraph.draw.text(ctx, this.get('name'), this.label_pt, txt_props, true);
        },

        draw_layer:function (ctx) {

            var txt_props = {};
            var pt = this.label_pt;
            pt[1] += 20;
            _.extend(txt_props, this.get('label_draw_props'), {fill:'rgb(255, 0, 0)'});
            flowgraph.draw.text(ctx, this.layer_index, pt, txt_props);

        },

        draw_diamond:function (ctx) {
            ctx.save();

            ctx.translate(this.get('width') - diamond_offset, diamond_offset);

            ctx.beginPath();
            ctx.moveTo(diamond_size, 0);
            ctx.lineTo(0, diamond_size);
            ctx.lineTo(-diamond_size, 0);
            ctx.lineTo(0, -diamond_size);
            ctx.lineTo(diamond_size, 0);
            ctx.closePath();
            flowgraph.draw.paint(ctx, diamond_style, true);

            ctx.restore();
        },

        draw_props:function (ctx) {
            var strength = this.get('strength');
            var out = {};

            _.extend(out, draw_props[strength]);

            if (this.get('is_selected')) {
                _.extend(out, draw_props['SELECTED']);
            }

            if (this.get('is_new')) {
                _.extend(out, draw_props['NEW']);
            } else {
                console.log('not over', this.get('id'));
            }

            if (this.get('is_over')) {
                _.extend(out, draw_props['OVER']);
            } else {
                console.log('not over', this.get('id'));
            }

            if (this.get('is_moving')) {
                _.extend(out, draw_props['MOVING']);
            } else {
                console.log('not over', this.get('id'));
            }

            return out;
        },

        dims:function (relative) {
            if (relative) {
                return [0, 0, this.get('width'), this.get('height')];
            } else {
                return [this.get('left'), this.get('top'), this.get('width'), this.get('height')];
            }
        },

        diamond_dims:function (relative) {
            var dims = [
                this.get('width') - diamond_offset - diamond_size, 0,
                this.get('width'), diamond_offset + diamond_size
            ];

            if (!relative) {
                dims[0] += this.get('left');
                dims[2] += this.get('left');
                dims[1] += this.get('top');
                dims[3] += this.get('top');
            }

            return dims;
        },

        get_right:function () {
            return this.get('left') + this.get('width');
        },

        get_bottom:function () {
            return this.get('top') + this.get('height');
        },

        mouse_over:function () {
            return flowgraph.mouse.in_rect(this.get('left'), this.get('top'), this.get_right(), this.get_bottom());
        },

        mouse_click:function () {
            if (flowgraph.mode == 'select') {

                if (this.mouse_over()) {
                    console.log('CLICKED ON ', this.get('name'));
                    if (flowgraph.mouse.in_rect.apply(flowgraph.mouse, this.diamond_dims())) {
                        show_item_form(this);
                    }
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
    });

    var Action_model = Backbone.Collection.extend({
        model:Action
    });

    flowgraph.collections.actions = new Action_model();

    return Action;
}();