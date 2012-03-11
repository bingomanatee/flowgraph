var show_item_form_item;
function show_item_form(item) {
    var f = $('#item_form');
    f.show();
    f.css('top', item.get('top'));
    f.css('left', item.get('left'));
    $('#item_form_item_name').val(item.get('name'));
    $('#item_form_item_id').html(item.get('_id'));
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

    /* ************ DRAW PROPS ******************* */

    var diamond_offset = 12;
    var diamond_size = 6;
    var dash_image_loaded = false;
    var item_id = 1;
    var stack_order = 0;

    function _draw(ctx) {
        var props = {};
        if (!dash_image_loaded){
            flowgraph.util.action_fills.init_dashed_image(ctx);
            dash_image_loaded = true;
        }

        var strength = this.get('strength');
        var af = flowgraph.util.action_fills;

        _.extend(props, af.strength[strength]);

        if (this.get('is_selected')) {
            _.extend(props, af.SELECTED);
        }

        if (this.get('is_new')) {
            _.extend(props, af.NEW);
        }

        if (this.get('is_over')) {
            _.extend(props, af.OVER);
        }

        if (this.get('is_moving')) {
            _.extend(props, af.MOVING);
        }

        flowgraph.draw.roundrect(ctx, this.dims(), props);

        ctx.save();
        ctx.translate(this.get('left'), this.get('top'));
        this.draw_label(ctx);
        this.draw_diamond(ctx);
        ctx.restore();
    }

    var Action = Backbone.Model.extend({
        type:'item',
        idAttribute: "_id",
        initialize:function () {
            if (!this.get('_id')) {
                this.set('_id', item_id++);
                this.set('name', item_id == 2 ? 'START' : 'Action ' + (item_id - 2));
            }
            if (!this.get('stack_order')){
                this.set('stack_order', ++stack_order);
            }
        },

        defaults:{
            top:0,
            left:0,
            stack_order: 0,
            width:120,
            height:75,
            strength:'normal',

            name:'untitled',
            is_new:true,
            is_over:false,
            moving:false,

            type:'item'
        },

        _toString:_.template('ITEM id <%= _id %> (<%= name %>, at <%= left %>, <%= top %>)'),

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

        toJSON: function(){
            return {
                name: this.get('name'),
                _id: this.get('_id'),
                left: this.get('left'),
                top: this.get('top'),
                style: this.get('style'),
                strength: this.get('strength')
            }
        },

        equals:function (item) {
            return item.get('_id') == this.get('_id');
        },

        pa:function () {
            return [this.get('left') + this.get('width') / 2, this.get('top') + this.get('height') / 2];
        },

        set_strength:function (v) {
            this.set('strength', v);
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
            _.extend(txt_props, flowgraph.util.action_fills.label_draw_props);
            flowgraph.draw.text(ctx, this.get('name'), this.label_pt, txt_props, true);
        },

        draw_layer:function (ctx) {

            var txt_props = {};
            var pt = this.label_pt;
            pt[1] += 20;
            _.extend(txt_props, flowgraph.util.action_fills.label_draw_props, {fill:'rgb(255, 0, 0)'});
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
            flowgraph.draw.paint(ctx, flowgraph.util.action_fills.diamond_style, true);

            ctx.restore();
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