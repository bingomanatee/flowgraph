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

    function Item(props) {
        this.top = 0;
        this.left = 0;
        this.width = 200;
        this.height = 120;
        this.type = 'item';
        this.label = 'untitiled';
        this.new = true;

        this.draw_props = {
            fill:'rgb(120, 120, 120)',
            stroke:{style:'rgb(0, 0, 0)', width:2}
        };

        this.new_draw_props = {
            fill:'rgba(255, 204, 0, 0.15)',
            stroke:_dashed
        };

        this.label_draw_props = {
            fill: 'rgb(0,0,0)',
            font: '10pt, sans-serif, bold',
            base: 'bottom'
        };

        _.extend(this, props);
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
            }

            flowgraph.draw.rect(ctx, this.dims(), props);

            this.draw_label(ctx);
        },

        label_pt: function(){
            return [this.left + 10, this.top + 20];
        },

        draw_label: function(ctx){

            var txt_props = {};
            _.extend(txt_props, this.label_draw_props);
            flowgraph.draw.text(ctx, this.name, this.label_pt(), txt_props);
        },

        dims:function () {
            return [this.left, this.top, this.width, this.height];
        },

        get_right: function(){ return this.left + this.width; },

        get_bottom: function() { return this.top + this.height; },

        mouse_over: function(){
            return flowgraph.mouse.in_rect(this.left, this.top, this.get_right(), this.get_bottom());
        },

        mouse_click: function(){
            return false;
        }
    }

    return Item;
}();