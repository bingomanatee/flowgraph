flowgraph.load = function(){

    function _load_action(action){

        var a = new flowgraph.sprites.Action(action);
        flowgraph.collections.actions.add(a);

    }

    function load(data){

        if (data.hasOwnProperty('actions')){
            data.actions.forEach(_load_action);
        }

        flowgraph.get_actions().forEach(function(action){
            var id = parseInt(action.get('_id'));
            data.links.forEach(function(link){
                if (link.from_node == id){
                    link.from_node = action;
                } else if (link.to_node == id){
                    link.to_node = action;
                }
            });
        });


        data.links.forEach(function(link){
            flowgraph.collections.links.add(link);
        });

    };


    return load;
}();