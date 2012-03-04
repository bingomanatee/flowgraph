var labelType, useGradients, nativeTextSupport, animate;

(function () {
    var ua = navigator.userAgent,
        iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
        typeOfCanvas = typeof HTMLCanvasElement,
        nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
        textSupport = nativeCanvasSupport
            && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();

var red = "#FF0000";
var yellow = "#FFFF00";

function link(f, t, c, n) {
    if (!n) {
        n = '';
    }
    return {"nodeTo":f, "nodeFrom":t, "data":{"$color":c, "$label":n},
        label:n
    };
}


var fd;

$(_init);

/* ************** FD INIT ************ */

function _init() {

    fd = new $jit.ForceDirected({
        injectInto:"infovis",
        Navigation:{
            enable:true,
            panning:'avoid nodes',
            zooming:10
        },
        Node:{
            overridable:true
        },
        Edge:{
            overridable:true,
            color:'#23A4FF',
            lineWidth:0.4
        },
        //Native canvas text styling
        Label:{
            type:labelType, //Native or HTML
            size:10,
            style:'bold',
            color:"black"
        },
        //Add Tips
        Tips:{
            enable:true,
            onShow:function (tip, node) {
                //count connections
                var count = 0;
                var cl = '';
                node.eachAdjacency(function (adj) {
                    count++;
                    cl += adj.nodeFrom.name + ' ... ' + adj.nodeTo.name + '<br />';
                });
                //display node info in tooltip
                tip.innerHTML = "<div class=\"tip-title\">" + node.name + "</div>"
                    + "<div class=\"tip-text\"><b>connections:</b> " + count + '<br />' + cl + "</div>";
            }
        },
        // Add node events
        Events:{
            enable:true,
            type:'Native',
            //Change cursor style when hovering a node
            onMouseEnter:function () {
                fd.canvas.getElement().style.cursor = 'move';
            },
            onMouseLeave:function () {
                fd.canvas.getElement().style.cursor = '';
            },
            //Update node positions when dragged
            onDragMove:function (node, eventInfo, e) {
                var pos = eventInfo.getPos();
                node.pos.setc(pos.x, pos.y);
                show_i_form(true, pos.x, pos.y);
                fd.plot();
            },
            //Implement the same handler for touchscreens
            onTouchMove:function (node, eventInfo, e) {
                $jit.util.event.stop(e); //stop default touchmove event
                this.onDragMove(node, eventInfo, e);
            },
            //Add also a click handler to nodes
            onClick:node_clicked
        }, //Number of iterations for the FD algorithm
        iterations:300,
        //Edge length
        levelDistance:120,
        // Add text to the labels. This method is only triggered
        // on label creation and only for DOM labels (not native canvas ones).
        onCreateLabel:function (domElement, node) {
            domElement.innerHTML = node.name;
            var style = domElement.style;
            style.fontSize = "0.8em";
            style.color = "#ddd";
        },
        // Change node styles when DOM labels are placed
        // or moved.
        onPlaceLabel:function (domElement, node) {
            var style = domElement.style;
            var left = parseInt(style.left);
            var top = parseInt(style.top);
            var w = domElement.offsetWidth;
            style.left = (left - w / 2) + 'px';
            style.top = (top + 10) + 'px';
            style.display = '';
        }
    });

    /* ******************** RUN! *********** */
    // load JSON data.
    fd.loadJSON(json);
    fd.refresh();
    // compute positions incrementally and animate.
    fd.computeIncremental({
        iter:120,
        property:'end',
        onStep:function (perc) {
        },
        onComplete:function () {
            fd.animate({
                modes:['linear'],
                transition:$jit.Trans.Elastic.easeOut,
                duration:2500
            });
        }
    });
    // end
}