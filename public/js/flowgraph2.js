var flowgraph = {

    last_redraw:0,

    mouse_left:function (e) {
        return e.pageX - flowgraph.jcanvas.offset().left;
    },

    mouse_top:function (e) {
        return e.pageY - flowgraph.jcanvas.offset().top;
    },

    Item:function (left, top, label) {
        this.top = top;
        this.left = left;
        this.label = label;
        this.dims = [left - flowgraph.rect.width / 2,
            top - flowgraph.rect.height / 2,
            flowgraph.rect.width,
            flowgraph.rect.height];
    },

    mouse_events:{
        move:function (e) {
            flowgraph.left = flowgraph.mouse_left(e);
            flowgraph.top = flowgraph.mouse_top(e);
            //console.log(flowgraph.left, ',', flowgraph.top);
        },

        click:function (e) {
            var rect = new flowgraph.Item(flowgraph.mouse_left(e), flowgraph.mouse_top(e), 'Foo');
            console.log("clicked");
            flowgraph.rects.push(rect);
        }
    },

    rects:[],

    snap:10,

    snapLeft:function () {
        return flowgraph.left - (flowgraph.left % flowgraph.snap);
    },

    snapTop:function () {
        return flowgraph.top - (flowgraph.top % flowgraph.snap);
    },
    left:0,
    top:0,

    width:800,
    height:600,

    rect:{width:40, height:20,
        fillStyle: 'rgba(230, 240, 255, 1.0)',
        moving_fillStyle: 'rgba(230, 240, 255, 0.25)'},

    draw_rect_at_mouse:function () {
        flowgraph.ctx.fillStyle = flowgraph.rect.moving_fillStyle;
        var dims = [
            flowgraph.snapLeft(),
            flowgraph.snapTop(),
            flowgraph.rect.width,
            flowgraph.rect.height];
        //console.log('dims: ', dims);
        flowgraph.ctx.moveTo(0, 0);
        flowgraph.ctx.strokeRect.apply(flowgraph.ctx, dims);
        flowgraph.ctx.fillRect.apply(flowgraph.ctx, dims);
    },

    redraw:function () {
        var t = new Date().getTime();
        if ((!flowgraph.last_redraw) || flowgraph.last_redraw + 10 < t) {
            flowgraph.last_redraw = t;
            var width = flowgraph.jcanvas.width();
            var height = flowgraph.jcanvas.height();

            flowgraph.ctx.clearRect(0, 0, width, height);

            flowgraph.rects.forEach(function(r){r.draw();});

            flowgraph.draw_rect_at_mouse();
        }
    }

};

flowgraph.Item.prototype = {
    draw:function () {
        flowgraph.ctx.fillStyle = flowgraph.rect.fillStyle;
        flowgraph.ctx.moveTo(0, 0);
        flowgraph.ctx.strokeRect.apply(flowgraph.ctx, this.dims);
        flowgraph.ctx.fillRect.apply(flowgraph.ctx, this.dims);
    }
}

function _init() {
    flowgraph.canvas = document.getElementById('canvas_div');
    flowgraph.jcanvas = $('#canvas_div');
    flowgraph.ctx = flowgraph.canvas.getContext('2d');
    flowgraph._interval = setInterval(flowgraph.redraw, 10);
    flowgraph.jcanvas.mousemove(flowgraph.mouse_events.move);
    flowgraph.jcanvas.click(flowgraph.mouse_events.click);
    var i = new Image();
    i.src = 'http://localhost:5103/img/toolbar.png';
    flowgraph.ctx.drawImage(i, 0, 0);
}

$(_init);