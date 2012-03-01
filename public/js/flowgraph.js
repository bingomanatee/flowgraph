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

function link(f, t, c) {
    return {"nodeTo":f, "nodeFrom":t, "data":{"$color":c}};
}


var json = [
    {
        "adjacencies":[
            link("g2", "g1", red),
            link("g3", "g1", red)
        ],
        data:{
            "$color":red,
            "$type":"circle",
            "$dim":20
        },
        "id":"g1",
        "name":"foo"
    },

    {
        "adjacencies":[
        ],
        data:{
            "$color":yellow,
            "$type":"circle",
            "$dim":20
        },
        "id":"g2",
        "name":"foo2"
    },

    {
        "adjacencies":[
        ],
        data:{
            "$color":yellow,
            "$type":"circle",
            "$dim":20
        },
        "id":"g3",
        "name":"foo3"
    }

];

var fd;

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
                node.eachAdjacency(function () {
                    count++;
                });
                //display node info in tooltip
                tip.innerHTML = "<div class=\"tip-title\">" + node.name + "</div>"
                    + "<div class=\"tip-text\"><b>connections:</b> " + count + "</div>";
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
                fd.plot();
            },
            //Implement the same handler for touchscreens
            onTouchMove:function (node, eventInfo, e) {
                $jit.util.event.stop(e); //stop default touchmove event
                this.onDragMove(node, eventInfo, e);
            },
            //Add also a click handler to nodes
            onClick:function (node) {
                if (!node) return;
                console.log('clicked on ' + node.id + ': ' + node.name);
                last_node = node;
                $('#link_from_id').val(node.id);
                // Build the right column relations list.
                // This is done by traversing the clicked node connections.
                $('$link2').val($('link1').val());
                $('$link2').val(node.id);

            }
        }, //Number of iterations for the FD algorithm
        iterations:200,
        //Edge length
        levelDistance:100,
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
        iter:40,
        property:'end',
        onStep:function (perc) {
            console.log('animation step');
        },
        onComplete:function () {
            console.log('complete');
            fd.animate({
                modes:['linear'],
                transition:$jit.Trans.Elastic.easeOut,
                duration:2500
            });
        }
    });
    // end
}

$(_init);

var last_node = null;
function add_node(f) {
    try {
        var id = f.elements.name.value;
        if (!last_node){
            last_node  = json[json.length - 1];
        }
        var n = {
            "adjacencies":[
                link(last_node.id, id, red),
            ],
            data:{
                "$color":yellow,
                "$type":"circle",
                "$dim":20
            },
            "id":id,
            "name":id
        };

        json.push(n);
        fd.loadJSON(json);
        fd.refresh();
    } catch (e) {
        console.log(e);
    }
    return false;
}

function link_nodes(f){
    json.forEach
}