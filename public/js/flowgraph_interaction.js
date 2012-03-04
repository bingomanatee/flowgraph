/* ******************************** node interaction ************ */

var last_node, this_node;


function node_clicked(node) {
    if (!node) return;
    console.log('node clicked: ', node);
    var type = node.getData('type');

    switch (type) {
        case 'fancynode':
            var checked = node.getData('checked');
            node.setData('checked', !checked);
            if (node.getData('quadrant') == 'BR') {
                update_form_with_node(node);
            }
            break;
        case 'fancybranch':
            var checked = node.getData('checked');
            node.setData('checked', !checked);
            if (node.getData('quadrant') == 'BR') {
                update_form_with_node(node);
            }
            break;
    }
    /*
     // Build the right column relations list.
     // This is done by traversing the clicked node connections.
     var html = "<h4>" + node.name + "</h4><b> connections:</b><ul><li>",
     list = [];
     node.eachAdjacency(function (adj) {
     list.push(adj.nodeTo.name);
     });
     //append connections information
     $jit.id('inner-details').innerHTML = html + list.join("</li><li>") + "</li></ul>";
     console.log('clicked:', fd); */
    fd.plot();

}
function update_form_with_node(node) {
    if (!node) return;
    console.log('clicked on ', node);
    last_node = this_node;
    this_node = node;
    update_display(true);
}

function show_i_form(show, x, y) {
    if (arguments.length > 1) {
        $('#item_panel').css('top', y + 300);
        $('#item_panel').css('left', x + 300);
    }

    $('#item_panel')[show ? 'show' : 'hide']();
}

function rename_node() {
    show_i_form(false);
    if (!this_node) {
        return;
    }

    var new_name = $('#selected_item_name').val();
    if (new_name && (new_name != this_node.name)) {
        this_node.name = new_name;
        fd.refresh();
    }
}

function show_add_child_form(show, outer) {
    var id = outer ? '#add_child_form_outer' : '#add_child_form';
    console.log('setting add child form', id, 'to', show);
    $(id)[show ? 'show' : 'hide']();
}

function show_add_branch_choice_form(show, outer) {
    var id = outer ? '#add_branch_choice_form_outer' : '#add_branch_choice_form';
    $(id)[show ? 'show' : 'hide']();
}

var _shown_id = -1;

function _adj_list(node) {
    var nodes = {};
    var joints = {};

    console.log('******* _adj_jist: ', node.name);

    function _node_adjacent_to_joint(node) {
        var is_adj = false;
        node.eachAdjacency(function (n) {
            if (is_adj || joints[n.id]) {
                is_adj = true;
            }
        });
        return is_adj;
    }

    node.eachAdjacency(function (node_adj) {
        var n = node_adj.nodeTo;

        if (!n) return;
        var type = n.getData('type');
        console.log('looking at out adjacency ', n.name, ':', type);
        if (type == 'joint') {
            joints[n.id] = n;

            console.log('.... adding joint');

            n.eachAdjacency(function (node_to_adj) {
                var n2 = node_to_adj.nodeTo;
                console.log('looking at joint adj ', n2);

                var type = n2.getData('type');
                switch (type) {
                    case 'joint':
                        break;

                    case 'fancynode':
                        nodes[n2.id] = n2;
                        console.log('.... adding NODE');
                        break;

                    case 'fancybranch':
                        nodes[n2.id] = n2;
                        console.log('.... adding NODE');
                        break;


                }
            });
        }
    });

    $jit.Graph.Util.eachNode(fd.graph, function (n) {

        var type = n.getData('type');
        switch (type) {
            case 'joint':
                break;

            case 'fancynode':
                if (_node_adjacent_to_joint(n)) {
                    nodes[n.id] = n;
                }
                break;

            case 'fancybranch':
                if (_node_adjacent_to_joint(n)) {
                    nodes[n.id] = n;
                }
                break;

        }

    });

    return nodes;
}

function _node_conn_list(node) {
    var html = [];

    var nodes = _adj_list(node);

    for (var id in nodes) {
        if (id != node.id){
            html.push('<div>' + nodes[id].name + '</div>');
        }
    }
    console.log('conn list: ', html);
    return html.join('');
}

function show_node_children(node, type) {
    console.log('-------- SHOW NODE CHILDREN -----------');
    if (node) {

        var item_choice_list = $('#item_choice_list');
        var item_conn_list = $('#item_conn_list');
        var item_conns = $('#item_conns');
        var item_choices = $('#item_choices');

        if (!type) {
            type = node.getData('type');
        }

        switch (type) {
            case 'fancynode':
                item_conns.show();
                item_choices.hide();
                item_choice_list.html('');
                break;

            case 'fancybranch':
                item_conns.hide();
                item_conn_list.html('');
                break;
        }

        _shown_id = node.id;

        var item_conn_list = _node_conn_list(node);

        item_conns.html(item_conn_list);

        item_conn_list.show();
    }
}

function update_display(init) {

    if (!this_node) {
        $('#selected_item_name').val('-- select node --');
        $('#selected_item_type').html('&nbsp;');
        show_i_form(false);
        return;
    }

    var type = this_node.getData('type');

    if (init) {
        var p = this_node.pos.getc();
        show_i_form(true, p.x, p.y);
        show_add_child_form(false);
        show_add_branch_choice_form(false);
        $('#selected_item_name').val(this_node.name);
        $('#selected_item_type').html(type);
    }

    var name_value = $('#new_item_name').val();

    if (name_value.length > 1 && (name_value != this_node.name)) {
        $("item_rename_button").show();
    } else {
        $("item_rename_button").hide();
    }

    switch (type) {
        case "fancynode":
            show_add_child_form(true, true);
            show_add_branch_choice_form(false, true);
            console.log('name_value:', name_value, ', length', name_value.length);
            if (name_value.length > 2) {
                $('#add_child_btn').show();
            } else {
                $('#add_child_btn').hide();
            }
            show_node_children(this_node, type);
            break;

        case "fancybranch":
            show_node_children(this_node, type);
            show_add_child_form(false, true);
            show_add_branch_choice_form(true, true);
            break;
    }
}

function can_link() {
    return this_node && last_node && (this_node.id != last_node.id);
}

function connect_nodes() {
    if (!(last_node && this_node)) {
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

    json.forEach(function (node) {
        if (node.id == last_node.id) {
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

    var joint_data = {
        "adjacencies":[
            link(id, conn_id, 'black'),
            link(this_node.id, conn_id, 'black')
        ],
        data:{
            "$dim":dim,
            "$type":'joint',
            '$color':'white',
            "$repel":2
        },
        "id": conn_id,
        "name": conn_name
    };

    var new_node_data = {
        "adjacencies":[
            link(id, conn_id, 'black')
        ],
        data:{
            "$color":color,
            '$type': type,
            "$width":120,
            "$height":100
        },

        id:id,
        name:name
    }

    json.forEach(function (old_node) {
        if (old_node.id == this_node.id) {
            old_node.adjacencies.push(link(conn_id, old_node.id, 'black'));
        }
    });

    console.log('new child: ', new_node_data, 'type', type);
    json.push(new_node_data);
    json.push(joint_data);
    fd.loadJSON(json);
    fd.refresh();
    this_node = null;
    update_display();
}

update_display();