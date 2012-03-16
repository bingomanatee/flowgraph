flowgraph.util.action_fills = function () {

    var _dashed = {fill:'rgb(0,200,0)', width:2};

    var _dash_img = null;

    var _edit_icon = {fill:'rgb(102, 102, 0)'};

    var _edit_icon_img = null;

    var WIDTH = 120;
    var HEIGHT = 75;

    var MED_BLUE = '#a69ddf';
    var WHITE = '#ffffff';
    var LT_BLUE = '#ebe8ff';
    var DK_BLUE = '#847eac';
    var YORANGE = 'rgb(255, 204, 102)';
    var ORANGE = 'rgb(255, 102, 0)';
    var BLACK = 'rgb(0, 0, 0)';
    var GREY_20 = 'rgb(' + [(255 * 0.2), (255 * 0.2), (255 * 0.2)].join(',') + ')';
    var GREY_30 = 'rgb(' + [(255 * 0.3), (255 * 0.3), (255 * 0.3)].join(',') + ')';
    var GREY_50 = 'rgb(' + [(255 * 0.5), (255 * 0.5), (255 * 0.5)].join(',') + ')';
    var GREY_80 = 'rgb(' + [(255 * 0.8), (255 * 0.8), (255 * 0.8)].join(',') + ')';
    var WHITE_A80 = 'rgba(255, 255, 255, 0.8)';
    var WHITE_A20 = 'rgba(255, 255, 255, 0.2)';
    var WHITE_A0 = 'rgba(255, 255, 255, 0.0)';
    var YELLOW = 'rgb(225, 255, 51)';

    var LT_PURPLE = '#febaff';
    var PURPLE = '#fc00ff';
    var DK_PURPLE = '#723b73';

    function _selected_blend(ctx, props) {
        var stops = [
            {stop:0, color:YORANGE},
            {stop:0.15, color:ORANGE},
            {stop:0.5, color:DK_BLUE}
        ];
        var coords = [60, 40, 10, 60, 40, 50];

        return flowgraph.draw.grad(ctx, stops, coords, 'radial');
    }

    function _branch_blend(ctx, props) {
        var stops = [
            {stop:0.0, color:WHITE},
            {stop:0.3, color:LT_PURPLE},
            {stop:0.9, color:DK_PURPLE}
        ];

        var coords = [WIDTH / 2, HEIGHT / 2, HEIGHT / 10, WIDTH / 2, HEIGHT / 2, WIDTH / 2];

        return flowgraph.draw.grad(ctx, stops, coords, 'radial');
    }

    function _item_blend_hl(ctx, props) {
        var stops = [
            {stop:0.0, color:WHITE_A80},
            {stop:0.25, color:WHITE_A20},
            {stop:1, color:WHITE_A0}
        ];
        var coords = [60, 40, 10, 60, 24, 200];

        return flowgraph.draw.grad(ctx, stops, coords, 'radial');
    }

    function _item_blend_major(ctx, props) {
        var stops = [
            {stop:0.0, color:DK_BLUE},
            {stop:0.6, color:LT_BLUE},
            {stop:0.6125, color:MED_BLUE},
            {stop:1, color:DK_BLUE}
        ];
        var coords = [0, 0, 0, 75];

        return flowgraph.draw.grad(ctx, stops, coords, 'linear');
    }

    function _item_blend(ctx, props) {
        var stops = [
            {stop:0.0, color:MED_BLUE},
            {stop:0.4, color:LT_BLUE},
            {stop:0.6, color:WHITE},
            {stop:0.6125, color:LT_BLUE},
            {stop:1, color:DK_BLUE}
        ];
        var coords = [0, 0, 0, 75];

        return flowgraph.draw.grad(ctx, stops, coords, 'linear');
    }

    function _item_blend_minor(ctx, props) {

        var stops = [
            {stop:0.0, color:LT_BLUE},
            {stop:0.6, color:WHITE},
            {stop:0.6125, color:LT_BLUE},
            {stop:1, color:LT_BLUE}
        ];
        var coords = [0, 0, 0, 75];

        return flowgraph.draw.grad(ctx, stops, coords, 'linear');
    }

    function _start_blend(ctx, props) {
        var stops = [
            {stop:0, color:WHITE},
            {stop:1, color:BLACK}
        ];

        var coords = [-10, -20, 0, -20, -20, 50];
   //     console.log('start blend: ', coords);
        return flowgraph.draw.grad(ctx, stops, coords, 'radial');
    }

    var _default_label_props = {
        fill:BLACK,
        font:'bold 14px sans-serif',
        base:'bottom'
    };
    var _branch_label_props = {
        fill:BLACK,
        font:'bold 16px sans-serif',
        base:'bottom',
        align:'center'
    };

    var _start_label_props = {
        fill:WHITE,
        font:'bold 20px sans-serif',
        base:'bottom',
        align:'center'
    }

    function _on_ei_load() {
        fills.icons.edit.image = _edit_icon_img;
    }

    var fills = {

        init_dashed_image:function (ctx) {
            _dash_img = new Image();
            _dash_img.onload = function () {
                _dashed.fill = ctx.createPattern(_dash_img, 'repeat');
            };

            _dash_img.src = '/js/flowgraph/sprites/dashed.png';
            return true;
        },

        init_edit_image:function (ctx) {
            _edit_icon_img = new Image();
            _edit_icon_img.onload = _on_ei_load;

            _edit_icon_img.src = '/js/flowgraph/sprites/icons/edit.png';
            return true;
        },

        diamond_style:{stroke:{width:1, fill:'rgba(0,0,0, 0.5)'}, stroke_first:true, fill:'rgb(102, 255, 51)'},

        label_draw_props:{
            major:_default_label_props,
            normal:_default_label_props,
            minor:_default_label_props,
            start:_start_label_props,
            branch:_branch_label_props
        },

        HL:{ fill:_item_blend_hl },

        strength:{

            major:{
                fill:_item_blend_major, stroke_first:true, stroke:{
                    fill:BLACK, width:5
                }
            },

            normal:{
                fill:_item_blend, stroke_first:true, stroke:{
                    fill:GREY_50, width:2
                }
            },

            minor:{
                fill:_item_blend_minor, stroke:{
                    fill:GREY_80, width:2
                }
            },

            start:{
                fill:_start_blend, stroke_first:true, stroke:{
                    fill:YELLOW, width:5
                }
            },

            branch:{
                fill:_branch_blend, stroke_first:true, stroke:{
                    fill:BLACK, width:1
                }
            }
        },

        icons:{
            edit:{
                image:false
            }
        },

        SELECTED:{
            fill:_selected_blend
        },

        OVER:{
            stroke:{
                width:4, fill:'rgb(255, 102, 0)'
            }
        },

        NEW:{
            fill:'rgba(255, 204, 0, 0.15)', stroke:_dashed
        },

        MOVING:{
            stroke:{
                fill:_dashed
            }
        }
    };

    return fills;
}()