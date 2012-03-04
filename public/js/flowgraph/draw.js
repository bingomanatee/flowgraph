flowgraph.draw = function () {

    function _layer_index(layer) {
        return layer.index;
    }

    function _layer_draw(layer) {
        //  console.log('drawing layer', layer.name);
        layer.draw(flowgraph.ctx);
    }

    var draw = {

        last_redraw:0,

        screen_refresh:5,

        point_in_rect:function (x, y, l, t, r, b) {
            return (x >= l) && (x <= r) && (y >= t) && (y <= b);
        },

        update:function () {
            var t = new Date().getTime();
            if ((!draw.last_redraw) || draw.last_redraw + draw.screen_refresh < t) {
                draw.last_redraw = t;

                var width = flowgraph.jcanvas.width();
                var height = flowgraph.jcanvas.height();

                draw.rect(flowgraph.ctx, [0, 0, width, height], {fill:'clear'});
                flowgraph.layers.items().forEach(_layer_draw);

                //  _.sortBy(_.toArray(flowgraph.layers), _layer_index).forEach(_layer_draw);
            }
        },

        grad:function (ctx, stops, coords, type) {
            var g = (type == 'radial') ?
                ctx.createRadialGradient.apply(ctx, coords) :
                ctx.createLinearGradient.apply(ctx, coords);
            stops.forEach(function (stop) {
                g.addColorStop(stop.stop, stop.color);
            });

            return g;
        },

        text: function(ctx, str, pt, props, no_state){
            if (!no_state){
                ctx.save();
            }

            if (props.font){
                ctx.font = props.font;
            }
            if (props.align){
                ctx.textAlign = props.align;
            }
            if (props.base){
                ctx.textBaseline = props.base;
            }

            ctx.fillText(str, pt[0], pt[1]);

            if (!no_state){
                ctx.restore();
            }
        },

        rect:function (ctx, dims, props, no_state) {

            if (!no_state) {
                ctx.save();
            }

            if (props.fill && (!props.stroke_first)) {

                switch (props.fill) {
                    case true:
                        break;

                    case 'clear':
                        ctx.clearRect.apply(ctx, dims);
                        return;
                        break;

                    default:
                     //  console.log('fill: ', props.fill);
                        ctx.fillStyle = props.fill;
                }

                ctx.fillRect.apply(ctx, dims);
            }

            if (props.stroke) {
                switch (props.stroke) {
                    case true:

                        break;

                    default:
                        if (_.isObject(props.stroke)) {
                            if (props.stroke.hasOwnProperty('width')) {
                                //  console.log('setting line width to ', props.stroke.width);
                                ctx.lineWidth = props.stroke.width;
                            }
                            if (props.stroke.hasOwnProperty('style')) {
                                //    console.log('setting line style to ', props.stroke.style);
                                ctx.strokeStyle = props.stroke.style;
                            }
                        }
                }
                //    console.log('stroking rect ', dims);
                ctx.strokeRect.apply(ctx, dims);
            }

            if (props.fill && props.stroke_first) {
                flowgraph.draw.rect(ctx, dims, {fill:props.fill}, true);
            }

            if (!no_state) {
                ctx.restore();
            }
        },

        init:function () {
            draw._interval = setInterval(draw.update, draw.screen_refresh);
        }
    };
    return draw;
}();