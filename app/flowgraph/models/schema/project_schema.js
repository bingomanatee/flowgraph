var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Represents a connection between two things
 */

module.exports = {
    label: {type: String, required: true},
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
    shape: [String],
    created:{type:Date, 'default':Date.now, required:true},
    deleted: {type: Boolean, 'default': false}
}