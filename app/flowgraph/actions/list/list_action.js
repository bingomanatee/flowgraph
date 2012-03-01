

module.exports = {

    route: '/flowgraphs',

    execute: function(req_state, cb){

        function _on_projects(err, projects){
            cb (err, {projects: projects});
        }

        req_state.framework.models.flowgraph_project.all().sort('label', 1).run(_on_projects);

    }
}