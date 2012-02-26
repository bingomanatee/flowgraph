var mongoose = require('mongoose');
var util = require('util');

module.exports = {
    params:{
        port:27017,
        host:'localhost',
        db:'flowgraph',
        wait_time: 10 * 1000
    },

    connect:function (mongo_params, callback) {
        var wait_time = 10 * 1000;

        if (!mongo_params) {
            mongo_params = module.exports.params;
        }
        var conn_string = _conn_string(mongo_params);

        if (mongo_params.hasOwnProperty('wait_time')){
            wait_time = mongo_params.wait_time;
        }

        console.log('conn string: %s', conn_string);
        _abort_db = mongo_params.db;

        mongoose.connect(conn_string);
        mongoose.connection.on('open', function(){
            clearTimeout(_abort_id);
            callback();
        });

        _abort_id = setTimeout(_abort, wait_time);
    }
}

var _abort_id;
var _abort_db;

function _abort(){
    console.log("!!!!!!!! ERROR: cannot connect to %s", _abort_db);
    process.kill(process.pid);
}

function _conn_string(mongo_params){
    return util.format('mongodb://%s:%s/%s',
                mongo_params.host, mongo_params.port, mongo_params.db)
}