var util = require('util');

module.exports = {

    route:'/flowgraph/:id/action/:action_id',

    load_req_params:true,

    execute:function (req_state, cb) {

        var project_model = req_state.framework.models.flowgraph_project;
        var action_model = req_state.framework.models.flowgraph_action;


        function _on_params(err, params) {
            console.log('params: %s', util.inspect(params));

            function _on_get_project(err, project) {
                if (!project){
                    return cb('Cannot find project ' + params.id);
                }

                function _on_new_action(err, action){
                    if (action){
                        console.log('made new action %s', util.inspect(action));
                        cb (null, {project: project, action: action});
                    } else {
                        console.log('cannot create NEW action: ', err);
                        cb ('action not found or created');
                    }
                }

                function _on_old_action(err, action){
                    if (action){
                        console.log('found OLD action %s', util.inspect(action));
                        cb (null, {project: project, action: action});
                    } else {
                        console.log('making new action...');
                        action_model.put({project_id: params.id, action_id: params.action_id}, _on_new_action);
                    }
                }
                action_model.find_one({project_id: params.id, action_id: params.action_id}, _on_old_action);
            }

            project_model.get(params.id, _on_get_project);
        }

        req_state.get_params(['id', 'action_id'], _on_params, function () {
            callback('No ID');
        })
    }

}