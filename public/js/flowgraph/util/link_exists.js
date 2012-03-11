

flowgraph.util.link_exists = function(n1, n2){

    var link_layer = flowgraph.get_links();

    var exists = false;

    link_layer.forEach(function(link){
        if (link.connects(n1, n2)){
            exists = true;
        }
    });

    return exists;

};