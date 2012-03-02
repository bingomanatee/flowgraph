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


var json = [
    {
        "adjacencies":[
        ],
        data:{
            "$color":red,
            "$type":"circle",
            "$dim":20
        },
        "id":"start_id",
        "name":"Start"
    }

];

var fd;

$(_init);
/* ******************************** node interaction ************ */


var last_node, this_node;
function update_form_with_node(node) {
    if (!node) return;
    console.log('clicked on ', node);
    last_node = this_node;
    this_node = node;
    update_display();
}

function update_display() {
    if (this_node) {
        $('#selected_item_name').html(this_node.id + ': ' + this_node.name);
        $('#selected_item_type').html('Node');
        $('#add_child_form').show();
        var adj = [];
        this_node.eachAdjacency(function (n) {
            console.log('link node: ', n);

            var node = n.nodeFrom;
            if (!(node.id == this_node.id)) {
                var t = '<div>';
                t += node.name + '</div>';
                adj.push(t);
            }
        });

        $('#conn_list').html(adj.join(''));

    } else {
        $('#selected_item_name').html('-- select node --');
        $('#selected_item_type').html('&nbsp;');
        $('#add_child_form').hide();
    }
    if (last_node) {
        $('#last_item_name').html(last_node.id + ': ' + last_node.name);
        $('#last_item_type').html('Node');
        $('#last_item').show();
    } else {
        $('#last_item').hide();
    }

    if ($('#new_item_name').val()) {
        $('#add_node_btn').show();
    } else {
        $('#add_node_btn').hide();
    }

}

function can_link() {
    return this_node && last_node && (this_node.id != last_node.id);
}

function connect_nodes() {
    if (!(last_node && this_node)){
        return;
    }
    var name = $('#connection_name').val();
    var id = Math.round(Math.random() * 100000) + "conn";

    var n = {
        "adjacencies":[
            link(this_node.id, id, 'black'),
            link(last_node.id, id, 'black')
        ],
        data:{
            "$dim":10,
            "$type":'circle',
            "$color":'white',
            "$node_type":"connector"
        },
        "id":id,
        "name":name
    };

    if (can_link()) {
        json.push(n);
    }

    json.forEach(function(node){
        if (node.id == last_node.id){
           node.adjacencies.push(link())
        }
    });

    fd.loadJSON(json);
    fd.refresh();
    update_display();
}

function add_node_child() {
    if (!this_node) {
        return;
    }
    var dim = parseInt($('#new_node_size').val());
    var type = $('#new_node_type').val();
    var color = $('#new_node_color').val();
    var name = $('#new_item_name').val();
    $('#new_item_name').val('');
    var conn_name = $('#new_conn_item_name').val();

    var id = Math.round(1000000 * Math.random()).toString();
    var conn_id = id + 'conn';
    var n = {
        "adjacencies":[
            link(id, conn_id, 'black')
        ],
        data:{
            "$dim":dim,
            "$type":type,
            "$color":color
        },
        "id":id,
        "name":name
    };
    var conn = {
        "adjacencies":[
            link(id, conn_id, 'black'),
            link(this_node.id, conn_id, 'black')
        ],
        data:{
            '$color':'white'

        },

        id:conn_id,
        name:conn_name
    }

    json.forEach(function(old_node){
       if (old_node.id == this_node.id){
           old_node.adjacencies.push(link(conn_id, old_node.id, 'black'));
       }
    });

    console.log('new child: ', n, 'type', type);
    json.push(conn);
    json.push(n);
    fd.loadJSON(json);
    fd.refresh();
    this_node = null;
    update_display();
}

update_display();

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
            onClick:update_form_with_node
        }, //Number of iterations for the FD algorithm
        iterations:300,
        //Edge length
        levelDistance:40,
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