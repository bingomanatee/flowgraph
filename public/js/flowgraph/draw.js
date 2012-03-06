flowgraph.draw = function () {

    function _layer_index(layer) {
        return layer.index;
    }

    function _layer_draw(layer) {
        layer.draw(flowgraph.ctx);
    }

    var draw = {

        last_redraw:0,

        screen_refresh:5,

        line: function(ctx, path, props, no_state){
            if(!no_state){
                ctx.save();
            }
            console.log('line: ', path.join(', '));
            ctx.beginPath();

            ctx.moveTo.apply(ctx, path.slice(0, 2));
            path = path.slice(2);
            while(path.length){
                ctx.lineTo.apply(ctx, path.slice(0, 2));
                path = path.slice(2);
            }

            ctx.closePath();

            this.apply_stroke(props.stroke);
            ctx.stroke();

            if(!no_state){
                ctx.restore();
            }
        },

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
                var items = flowgraph.layers.items();
                items.forEach(_layer_draw);

                var dl = flowgraph.layers.get('drawing');
                var state = '<pre>' + dl.sprites.toString() + '</pre>';
                $('#sprite_log').html(state);
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

        text:function (ctx, str, pt, props, no_state) {
            if (!no_state) {
                ctx.save();
            }

            if (props.fill) {
                draw.apply_fill(ctx, props.fill, props);
            }

            if (props.font) {
                ctx.font = props.font;
            }
            if (props.align) {
                ctx.textAlign = props.align;
            }
            if (props.base) {
                ctx.textBaseline = props.base;
            }

            ctx.fillText(str, pt[0], pt[1]);

            if (!no_state) {
                ctx.restore();
            }
        },

        rect:function (ctx, dims, props, no_state) {

            if (!no_state) {
                ctx.save();
            }

            if (props.fill && (!props.stroke_first)) {
                if (props.fill == 'clear'){
                    ctx.clearRect.apply(ctx, dims);
                } else {
                    draw.apply_fill(ctx, props.fill, props);
                    ctx.fillRect.apply(ctx, dims);
                }

            }

            if (props.stroke) {
                draw.apply_stroke(ctx, props.stroke, props);
                //    console.log('stroking rect ', dims);
                ctx.strokeRect.apply(ctx, dims);
            }

            if (props.fill && props.stroke_first) {
                draw.apply_fill(ctx, props.fill, props);
                ctx.fillRect.apply(ctx, dims);
            }

            if (!no_state) {
                ctx.restore();
            }
        },

        paint:function (ctx, props, no_state) {

            if (!no_state) {
                ctx.save();
            }

            if (props.fill && (!props.stroke_first)) {
                draw.apply_fill(ctx, props.fill, props);

                ctx.fill();
            }

            if (props.stroke) {
                draw.apply_stroke(ctx, ctx.stroke, props);
                //    console.log('stroking rect ', dims);
                ctx.stroke();
            }

            if (props.fill && props.stroke_first) {
                flowgraph.draw.paint(ctx, {fill:props.fill}, true);
            }

            if (!no_state) {
                ctx.restore();
            }

        },

        apply_fill:function (ctx, fill, props) {
            switch (fill) {
                case true:
                    break;

                default:
                    if (_.isFunction(fill)) {
                        ctx.fillStyle = fill(ctx, props);
                    } else {
                        ctx.fillStyle = fill;
                    }
                //  console.log('fill: ', props.fill);
            }
        },

        apply_stroke:function (ctx, stroke, props) {
            switch (stroke) {
                case true:

                    break;

                default:
                    if (_.isObject(stroke)) {
                        if (stroke.hasOwnProperty('width')) {
                            //  console.log('setting line width to ', stroke.width);
                            ctx.lineWidth = stroke.width;
                        }
                        if (stroke.hasOwnProperty('style')) {
                            //    console.log('setting line style to ', stroke.style);
                            ctx.strokeStyle = stroke.style;
                        }
                    } else if (_.isFunction(stroke)) {
                        ctx.strokeStyle = stroke(ctx, props);
                    } else {
                        ctx.strokeStyle = stroke;
                    }
            }
        },

        init:function () {
            draw._interval = setInterval(draw.update, draw.screen_refresh);
        }
    };
    return draw;
}();