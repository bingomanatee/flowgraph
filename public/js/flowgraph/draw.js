flowgraph.draw = function () {

    function _layer_index(layer) {
        return layer.index;
    }

    function _layer_draw(layer) {
        layer.draw(flowgraph.ctx);
    }

    function _sod(item) {
        return item.sort_order * -1;
    }

    var draw = {

        last_redraw:0,

        screen_refresh:50,

        line:function (ctx, path, props, no_state) {
            if (!no_state) {
                ctx.save();
            }
            //      console.log('line: ', path.join(', '), 'props:', JSON.stringify(props));
            ctx.beginPath();

            ctx.moveTo.apply(ctx, path.slice(0, 2));
            path = path.slice(2);
            while (path.length) {
                ctx.lineTo.apply(ctx, path.slice(0, 2));
                path = path.slice(2);
            }

            ctx.closePath();

            this.apply_stroke(ctx, props.stroke, props);
            ctx.stroke();

            if (!no_state) {
                ctx.restore();
            }
        },

        point_in_rect:function (x, y, l, t, r, b) {
            return (x >= l) && (x <= r) && (y >= t) && (y <= b);
        },

        clear:function () {

            var width = flowgraph.jcanvas.width();
            var height = flowgraph.jcanvas.height();

            draw.rect(flowgraph.ctx, [0, 0, width, height], {fill:'clear'});
        },

        update:function () {
            var t = new Date().getTime();
            if ((!draw.last_redraw) || draw.last_redraw + draw.screen_refresh < t) {
                draw.last_redraw = t;
                draw.clear();

                flowgraph.layers.tools.forEach(_layer_draw);
                var actions = flowgraph.collections.actions.sortBy(_sod);
                actions.forEach(_layer_draw);
                var links = flowgraph.collections.links.sortBy(_sod)
                links.forEach(_layer_draw);
                flowgraph.layers.bg.forEach(_layer_draw);

                var dl = flowgraph.layer('drawing');
                var ll = flowgraph.layer('links');

                var state = "<pre>ACTIONS: \n"
                    actions.forEach(function(i){ state += i.toString() + "\n"; })
                    state += "\nLINKS: \n";
                    links.forEach(function(i){ state += i.toString() + "\n"; });
                    state += '</pre>';
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

        roundrect_inner_shadow:function (ctx, dims, props) {
            ctx.save();
            ctx.beginPath();
            this._round_rect_path(ctx, dims);
            ctx.clip();

            ctx.beginPath();
            this._round_rect_bounds_path(ctx, dims, {});
            ctx.closePath();

            ctx.globalCompositeOperation = 'darker';
            ctx.shadowOffsetX = -2;
            ctx.shadowOffsetY = -4;
            ctx.shadowBlur = 6.0;
            ctx.shadowColor = 'rgba(0, 0,0, 0.25)';
            ctx.fill();

            ctx.globalCompositeOperation = 'lighter';

            ctx.shadowBlur = 3.0;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fill();

            ctx.restore();
        },

        roundrect:function (ctx, dims, props, no_state) {
            if (no_state) {
                throw new error('Roundrect does not linke noState;')
            } else {
                ctx.save();

                ctx.beginPath();
                this._round_rect_path(ctx, dims, props);
                ctx.closePath();
                ctx.save();
                ctx.translate(dims[0], dims[1]);
                this.paint(ctx, props);
                ctx.restore();

                this.roundrect_inner_shadow(ctx, dims); //@TODO: pass in shadow params.
                this._round_rect_path(ctx, dims, props);

                ctx.restore();

            }
        },

        _round_rect_bounds_path:function (ctx, dims, props) {
            var left = dims[0];
            var top = dims[1];
            var width = dims[2];
            var height = dims[3];
            ctx.translate(left, top);
            ctx.moveTo(-50, -50);
            ctx.lineTo(-50, height + 50);
            ctx.lineTo(width + 50, height + 50);
            ctx.lineTo(width + 50, -50);
            ctx.lineTo(-50, -50);
            ctx.translate(-left, -top);
            /*
             ctx.moveTo(0, 0);
             ctx.lineTo(width, 0);
             ctx.lineTo(width, height);
             ctx.lineTo(0, height);
             ctx.lineTo(0, 0); */

            this._round_rect_path(ctx, dims, props);

        },

        _round_rect_path:function (ctx, dims, props) {
            var radius = 10;
            var TR = true;
            var TL = true;
            var BR = true;
            var BL = true;

            if (props && props.hasOwnProperty('roundrect')) {
                var rr = props.roundrect;
                if (rr.hasOwnProperty('radius')) {
                    radius = rr.radius;
                }

                if (rr.hasOwnProperty('TR')) {
                    TR = rr.TR;
                }

                if (rr.hasOwnProperty('TL')) {
                    TL = rr.TL;
                }

                if (rr.hasOwnProperty('BR')) {
                    BR = rr.BR;
                }

                if (rr.hasOwnProperty('BL')) {
                    BL = rr.BL;
                }
            }

            var left = dims[0];
            var top = dims[1];
            var width = dims[2];
            var height = dims[3];
            ctx.translate(left, top);

            if (TL) {
                ctx.moveTo(0, radius * 2);
                ctx.arcTo(0, 0, radius, 0, radius);
                ctx.lineTo(2 * radius, 0);
            } else {
                ctx.moveTo(0, 0);
            }

            if (TR) {
                ctx.lineTo(width - radius * 2, 0);
                ctx.arcTo(width, 0, width, radius, radius);
                ctx.lineTo(width, radius * 2);
            } else {
                ctx.lineTo(0, width);
            }

            if (BR) {
                ctx.lineTo(width, height - radius * 2);
                ctx.arcTo(width, height, width - radius, height, radius);
                ctx.lineTo(width - radius * 2, height);
            } else {
                ctx.lineTo(width, height);
            }

            if (BL) {
                ctx.lineTo(radius * 2, height);
                ctx.arcTo(0, height, 0, height - radius, radius);
                ctx.lineTo(0, height - radius * 2);
            } else {
                ctx.lineTo(0, height);
            }

            if (TL) {
                ctx.lineTo(0, radius * 2);
            } else {
                ctx.lineTo(0, 0);
            }
            ctx.translate(-left, -top);
        },

        rect:function (ctx, dims, props, no_state) {

            if (!no_state) {
                ctx.save();
            }

            if (props.fill && (!props.stroke_first)) {
                if (props.fill == 'clear') {
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

            if (_.isArray(props)) {
                var self = this;

                props.forEach(function (prop) {
                    self.paint(ctx, prop, true)
                });

            } else {
                if (props.fill && (!props.stroke_first)) {
                    draw.apply_fill(ctx, props.fill, props);

                    ctx.fill();
                }

                if (props.stroke) {
                    draw.apply_stroke(ctx, props.stroke, props);
                    //    console.log('stroking rect ', dims);
                    ctx.stroke();
                }

                if (props.fill && props.stroke_first) {
                    flowgraph.draw.paint(ctx, {fill:props.fill}, true);
                }
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
            //    console.log('applying stroke style: ', JSON.stringify(stroke));
            switch (stroke) {
                case true:

                    break;

                default:
                    if (_.isObject(stroke)) {
                        if (stroke.hasOwnProperty('width')) {
                            //      console.log('setting line width to ', stroke.width);
                            ctx.lineWidth = stroke.width;
                        }
                        if (stroke.hasOwnProperty('fill')) {
                            //         console.log('setting line style to ', stroke.fill);
                            ctx.strokeStyle = stroke.fill;
                        }
                        if (stroke.hasOwnProperty('join')) {
                            ctx.lineJoin = stroke.join;
                        }
                    } else if (_.isFunction(stroke)) {
                        ctx.strokeStyle = stroke(ctx, props);
                    } else if (stroke) {
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