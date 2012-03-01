var mongoose = require('mongoose');
var mongoose_model = require('nuby-express/lib/support/mongoose_model');
var schema = require('./schema/project_schema.js');

var _model;

module.exports = function () {
    if (!_model) {
        var Member = new mongoose.Schema(schema);
        var m = mongoose.model('Flowgraph_Project', Member);
        _model = mongoose_model.create(m);
    }

    return _model;
}