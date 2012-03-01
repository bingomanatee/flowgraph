var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Represents a connection between two things
 */

module.exports = {
    from_item:{type:Schema.ObjectId, ref:'Flowgraph_Item'},
    to_item:{type:Schema.ObjectId, ref:'Flowgraph_Item'},
    label: String,
    from_label: String,
    to_label: String,
    strength: {'type': Number, 'default': 5, min: 1, max: 10},
    tags: [String],
    shape: [String],
    order: {'type': Number, 'default': 0}

}