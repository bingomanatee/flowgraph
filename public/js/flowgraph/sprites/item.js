flowgraph.sprites.Item = function () {

    var dashed_image = null;

    function _init_dashed_image(ctx) {
        dashed_image = new Image();
        dashed_image.onload = function () {

            var dashed_pattern = ctx.createPattern(dashed_image, 'repeat');
            _dashed.style = dashed_pattern;
        };
        dashed_image.src = 'http://localhost:5103/js/flowgraph/sprites/dashed.png';
    }

    var _dashed = {style:'rgb(0,200,0)', width:2};

    var item_count = 0;

    function Item(props) {
        this.top = 0;
        this.left = 0;
        this.width = 200;
        this.height = 120;
        this.type = 'item';
        this.name = 'untitiled';
        this.new = true;

        this.draw_props = {
            fill:'rgba(150, 150, 200, 0.75)',
            stroke:{style:'rgb(0, 0, 0)', width:2}
        };

        this.new_draw_props = {
            fill:'rgba(255, 204, 0, 0.15)',
            stroke:_dashed
        };

        this.selected_draw_props = {
            stroke:{
                width:'4px',
                style:'rgb(204, 153, 0)'
            }
        }

        this.label_draw_props = {
            fill:'rgb(0,0,0)',
            font:'10pt, sans-serif, bold',
            base:'bottom'
        };

        _.extend(this, props);

        this.name = 'New Item ' + (++item_count);
    }

    Item.prototype = {
        draw:function (ctx) {
            var props = {};

            if (!dashed_image) {
                _init_dashed_image(ctx);
            }

            _.extend(props, this.draw_props);

            if (this.new) {
                _.extend(props, this.new_draw_props);
            } else if (this.selected) {
                _.extend(props, this.selected_draw_props);
            }

            ctx.save();
            ctx.translate(this.left, this.top);
            flowgraph.draw.rect(ctx, this.dims(true), props, true);
            this.draw_label(ctx);
            this.draw_diamond(ctx);
            ctx.restore();
           // this.draw_layer(ctx);
        },

        label_pt:[10, 20],

        draw_label:function (ctx) {
            var txt_props = {};
            _.extend(txt_props, this.label_draw_props);
            flowgraph.draw.text(ctx, this.name, this.label_pt, txt_props, true);
        },

        draw_layer:function (ctx) {

            var txt_props = {};
            var pt = this.label_pt;
            pt[1] += 20;
            _.extend(txt_props, this.label_draw_props, {fill:'rgb(255, 0, 0)'});
            flowgraph.draw.text(ctx, this.layer_index, pt, txt_props);

        },
        diamond_style:{stroke:{width:2, style:'rgb(0,0,0)'}, fill:'rgb(102, 255, 51)'},
        diamond_offset:12,
        diamond_size:6,
        draw_diamond:function (ctx) {
            ctx.save();

            ctx.translate(this.width - this.diamond_offset, this.diamond_offset);

            ctx.beginPath();
            ctx.moveTo(this.diamond_size, 0);
            ctx.lineTo(0, this.diamond_size);
            ctx.lineTo(-this.diamond_size, 0);
            ctx.lineTo(0, -this.diamond_size);
            ctx.lineTo(this.diamond_size, 0);
            ctx.closePath();
            flowgraph.draw.paint(ctx, this.diamond_style, true);

            ctx.restore();
        },

        dims:function (relative) {
            if (relative) {
                return [0, 0, this.width, this.height];
            } else {
                return [this.left, this.top, this.width, this.height];
            }
        },

        get_right:function () {
            return this.left + this.width;
        },

        get_bottom:function () {
            return this.top + this.height;
        },

        mouse_over:function () {
            return flowgraph.mouse.in_rect(this.left, this.top, this.get_right(), this.get_bottom());
        },

        mouse_click:function () {
            return false;
        }
    }

    return Item;
}();