var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Action_schema = new mongoose.Schema({
    top: Number,
    left: Number,
    style: String,
    stack_order: Number,
    name: String
});

var link_schema = new mongoose.Schema({
    style: Number,
    from_id: Number,
    to_id: Number,
    stack_order: Number,
    manual_label: String
});

/**
 * Represents a connection between two things
 */

module.exports = {
    label: {type: String, required: false},
    description: String,
    creator: {type:Schema.ObjectId, ref:'Member'},
    size: {
        height: {type: Number, 'default': 1000 },
        has_height: {type: Boolean, 'default': false},
        width: {type: Number, 'default': 1000},
        has_width: {type: Boolean, 'default': true},
        unit: {type: String, 'default': 'px'}
    },
    tags: [String],
    actions: [Action_schema],
    links: [link_schema],
    created:{type:Date, 'default':Date.now, required:true},
    deleted: {type: Boolean, 'default': false}
}