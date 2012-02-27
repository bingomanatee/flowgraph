var _ = require('underscore');

module.exports = {

    route: '/',

    params: {
        view: {
            header: '<h1>Welcome to Flowgraph</h1>'
        }
    },

    execute: function(req_state, callback){
        function _on_view(err, view){
            req_state.put_flash('I am a bad boy', 'error');
            callback(null, view);
        }

        req_state.get_param('view', _on_view);
    }


}