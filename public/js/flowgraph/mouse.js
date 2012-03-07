flowgraph.mouse = function () {

    function mouse_left(e) {
        return e.pageX - flowgraph.jcanvas.offset().left;
    }

    function mouse_top(e) {
        return e.pageY - flowgraph.jcanvas.offset().top;
    }


    var mouse = {

        snap_left:function (snap) {
            return mouse.left - (mouse.left % snap);
        },

        snap_top:function (snap) {
            return mouse.top - (mouse.top % snap);
        },

        click:function () {
            var layers = flowgraph.layers.items(true);

            for (var l = 0; l < layers.length; ++l) {
                var layer = layers[l];
                if (layer.mouse_click()) {
                  //  console.log('click detected');
                    return;
                }
            }
        },

        events:{
            move:function (e) {
                mouse.left = mouse_left(e);
                mouse.top = mouse_top(e);
                if ((!mouse.events._on_move) || mouse.events._on_move()) {
                    return true;
                } else {
                    return false;
                }
            },

            _on_move:function () {
                return true
            },

            _on_click:function () {
                return true
            },

            click:function (e) {
                if (!mouse.events._on_click) {
                  //  console.log('no clicker; mouse click');
                    mouse.click();
                } else if (mouse.events._on_click()) {
                    mouse.click();
                } else {
                  //  console.log('clicker intercepted: ', mouse.events._on_click.toString() );
                }

            }
        },

        in_rect:function (l, t, r, b) {
            return flowgraph.draw.point_in_rect(this.left, this.top, l, t, r, b);
        },

        snap:10,

        left:0,
        top:0
    }

    return mouse;
}();
