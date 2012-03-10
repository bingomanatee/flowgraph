var util = require('util');

module.exports = {

    method:['get', 'post'],

    route: '/flowgraphs/new',

    load_req_params: 'input',

    execute:function (req_state, callback) {
        if (req_state.method == 'post') {
            this.execute_post(req_state, callback);
        } else {
            callback(null, {project:{}});
        }
    },

    execute_post:function (req_state, callback) {
        var fgp = req_state.framework.models.flowgraph_project;

        function _on_put(err, project){
            if (err){
                callback(fgp.validation_errors(err));
            } else {
                req_state.put_flash(util.format('Project &quot;%s&quot; (%s) saved!', project.label, project._id.toString()),
                    'info', util.format('/flowgraph/%s', project._id.toString()));
            }
        }

        function _on_param(err, project){

            function _on_member(err, member){
                if (member){
                    project.creator = member;
                    fgp.put(project, _on_put);
                } else {
                    callback("You must log in to create a project");
                }
            }

            req_state.framework.resources.active_member(req_state, _on_member);
        }

        console.log(' params: %s', util.inspect(req_state.params));

        req_state.get_param(['input','project'], _on_param);
    }

}