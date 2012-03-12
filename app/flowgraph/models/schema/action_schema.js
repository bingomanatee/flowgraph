var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Represents a connection between two things
 */

module.exports = {
    project_id: {type:Schema.ObjectId, ref:'Flowgraph_Project'},
    action_id: Number,
    name: String,
    notes: String,
    top: Number,
    left: Number,
    strength: {type: String, 'default': 'normal'},
    tags: [String],
    elements: [Object]
}