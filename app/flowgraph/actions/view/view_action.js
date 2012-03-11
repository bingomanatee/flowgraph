module.exports = {

    route:'/flowgraph/:id',

    load_req_params:true,

    execute:function (req_state, cb) {

        function _on_get(err, project) {
            cb(null, {project:project});
        }

        function _on_id(err, id) {
            req_state.framework.models.flowgraph_project.get(id, _on_get);
        }

        req_state.get_param('id', _on_id, function () {
            callback('No ID');
        })
    }

}