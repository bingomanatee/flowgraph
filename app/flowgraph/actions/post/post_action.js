var _ = require('underscore');
var util = require('util');

module.exports = {

    route: '/flowgraph/:id',

    load_req_params: true,

    method: 'post',

    execute: function(req_state, callback){
        var proj_model = req_state.framework.models.flowgraph_project;

        console.log('raw body: ', req_state.req.body, typeof req_state.req.body);

        function _on_put(err, project) {
            console.log('put: err', util.inspect(err));
            callback(null, {project:project});
        }

        function _on_get(err, project){
            if (err){
                callback(err);
            } else {
                _.extend(project, req_state.req.body);
                project.save(_on_put);
            }
        }

        function _on_id(err, id) {
            proj_model.get(id, _on_get);
        }

        req_state.get_param('id', _on_id, function () {
            callback('No ID');
        })

    }
}