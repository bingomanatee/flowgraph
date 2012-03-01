var util = require('util');
var fs = require('fs');
var path = require('path');

var header_template;

function _header(err, view_props, cb, req_state){
    if (header_template){
        var head = header_template(view_props.render);
   //     console.log('head: %s', head);
        view_props.render.header = head;
        cb(err, view_props);
    } else{
        var ejs = req_state.framework.ejs;
       // console.log('ejs: %s', util.inspect(ejs));

        var template_path = path.resolve(__dirname, '../views/header.html');

        function _on_template(err, template){
            header_template = ejs.compile(template);
            _header(err, view_props, cb, req_state);
        }

        fs.readFile(template_path, 'utf8', _on_template);
        return;
    }


}

module.exports = {

    load: function(framework, callback){
        framework.add_render_filter(_header, 100);
        callback();
    }
}