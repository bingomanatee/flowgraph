var show_item_form_item;
function show_item_form(item) {
    var f = $('#item_form');
    f.show();
    f.css('top', item.top);
    f.css('left', item.left);
    $('#item_form_item_name').val(item.name);
    $('#item_form_item_id').html(item.id);
    $('#item_form_strength').val(item.strength);
    show_item_form_item = item;
}

function update_show_item_form() {
    var name = $('#item_form_item_name').val();
    if (name) {
        show_item_form_item.name = name;
    }
    show_item_form_item.set_strength($('#item_form_strength').val());
    
    var f = $('#item_form');
    f.hide();
}

function _selected_blend(ctx, props){
	var stops = [{stop: 0, color: 'rgb(255, 204, 102)'},
		{stop: 0.25, color: 'rgb(255, 102, 0)'},
		{stop: 1, color: 'rgb(0, 0, 0)'},
		];

	var coords = [60, 40, 10, 60, 24, 100];

   return flowgraph.draw.grad(ctx, stops, coords, 'radial');
}

function _item_blend(ctx, props){
	var stops = [
        {stop: 0.0, color: '#CC99FF'},
        {stop: 0.6, color: '#CCCCFF'},
        {stop: 0.675, color: '#9999CC'},
        {stop: 0.76, color: '#330066'},
        {stop: 1, color: '#330099'}
    ];

	var coords = [0, 0, 0, 60];

   return flowgraph.draw.grad(ctx, stops, coords, 'linear');
}

function _item_blend_hl(ctx, props){
	var stops = [
	{stop: 0.0, color: 'rgba(255, 255, 255, 1)'},
	{stop: 0.25, color: 'rgba(255, 255, 255, 0.2)'},
	{stop: 1, color: 'rgba(255, 255, 255, 0.0)'}
	];
	var coords = [60, 40, 10, 60, 24, 200];
	
	return flowgraph.draw.grad(ctx, stops, coords, 'radial');
}
    
flowgraph.sprites.Action = function () {

    var dashed_image = null;

    function _init_dashed_image(ctx) {
        dashed_image = new Image();
        dashed_image.onload = function () {

            var dashed_pattern = ctx.createPattern(dashed_image, 'repeat');
            _dashed.fill = dashed_pattern;
        };
        dashed_image.src = 'http://localhost:5103/js/flowgraph/sprites/dashed.png';
    }

    var _dashed = {fill:'rgb(0,200,0)', width:2};

    var item_count = 0;

    var item_id = 1;


    function Action(props) {
        this.top = 0;
        this.left = 0;
        this.width = 120;
        this.height = 75;
        this.strength = 0;

        this.name = 'untitiled';
        this.new = true;
        this.id = item_id++;
        this.over = false;
        this.moving = false;

        this.draw_props = {
            fill: _item_blend,
            stroke:{
            style:'rgb(0, 0, 0)', 
            width:1
            }
        };
        
        this.hl = {
        	fill: _item_blend_hl
        	}

        this.new_draw_props = {
            fill:'rgba(255, 204, 0, 0.15)',
            stroke:_dashed
        };

        this.moving_draw_props = {
            stroke: {fill:_dashed}
        };

        this.over_draw_props = {
            stroke:{
                width:4,
                fill:'rgb(255, 255, 0)'
            } 
        }

        this.label_draw_props = {
            fill:'rgb(0,0,0)',
            font:'10pt, sans-serif, bold',
            base:'bottom'
        };

        this.selected_draw_props = {
            fill: _selected_blend
        };

        this.name = 'New Action ' + (++item_count);

        if (props){
            _.extend(this, props);
        }
        this.type='item';
    }

    Action.prototype = {
        type: 'item',

        _toString: _.template('ITEM id <%= id %> (<%= name %>, at <%= left %>, <%= top %>'),

        to_s: function(){
            var out = this._toString(this);
         //   console.log('item to string: ', out);
        },
        
        to_j: function (stringify){
        	var out = {
        	id: this.id, 
        	name: this.name,
        	top: this.top,
        	left: this.left,
        	style: this.style };
        	
        	if (stringify){
        		return JSON.stringify(out);
        	} else {
        		return out;
        	}
        },
        
        equals: function(item){
        	return item.id == this.id;
        	},

        pa: function(){
          return [this.left + this.width / 2, this.top + this.height /2]  ;
        },
        
        set_strength: function(v){
        	v = parseInt(v);
        	console.log('setting strength of', this.toString(), 'to', v);
			if (v <= -10){
				// optional;
				this.strength = -10;
				this.width=80;
				this.height = 60;
				this.draw_props.fill = 'rgb(225, 225, 255)';
				this.draw_props.stroke.width = 0.5;
			} else if (v < 10){
				//standard
				this.strength = 0;
				this.width = 120;
				this.height = 75;
				this.draw_props.fill = _item_blend;
				this.draw_props.stroke.width = 1;
			} else {
				// critical path
				this.strength = 10;
				this.width = 150;
				this.height = 90;
				this.draw_props.fill = 'rgb(125, 125, 255)';
				this.draw_props.stroke.width = 3;
			}
        },
        
        center: function(){
            var out = new flowgraph.util.Point(this.left + this.width / 2, this.top + this.height /2);
          //  console.log('center of ', this.name, ':', out.toString());
            return out;
        },

        draw:function (ctx) {
            var props = {};

            if (!dashed_image) {
                _init_dashed_image(ctx);
            }

            _.extend(props, this.draw_props);

            if (this.new) {
                _.extend(props, this.new_draw_props);
            }

            if (this.over) {
                _.extend(props, this.over_draw_props);
            }

            if (this.selected){
                _.extend(props, this.selected_draw_props);
            }

            if (this.moving){
            	_.extend(props, this.moving_draw_props);
            }

            flowgraph.draw.roundrect(ctx, this.dims(), props);

            if (!this.selected){
                flowgraph.draw.roundrect(ctx, this.dims(), this.hl);
            }

            ctx.save();
            ctx.translate(this.left, this.top);
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
        diamond_style:{stroke:{width:1, fill:'rgb(0,0,0)'}, fill:'rgb(102, 255, 51)'},
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

        diamond_dims:function (relative) {
            var dims = [
                this.width - this.diamond_offset - this.diamond_size, 0,
                this.width, this.diamond_offset + this.diamond_size
            ];

            if (!relative) {
                dims[0] += this.left;
                dims[2] += this.left;
                dims[1] += this.top;
                dims[3] += this.top;
            }

            return dims;
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
            if (flowgraph.mode == 'select') {

                if (this.mouse_over()) {
                    console.log('CLICKED ON ', this.name);
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
        },

        toString: function(){
            return '(' + this.id + '): ' + this.name;
        }
    }

    return Action;
}();