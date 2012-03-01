var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Represents a connection between two things
 */

module.exports = {
    label: String,
    notes: String,
    from_label: String,
    to_label: String,

    strength: {'type': Number, 'default': 5, min: 1, max: 10},
    tags: [String],
    shape: [String],
    order: {'type': Number, 'default': 0},

    size: {
        height: {type: Number, 'default': 50 },
        has_height: {type: Boolean, 'default': false},
        width: {type: Number, 'default': 100},
        has_width: {type: Boolean, 'default': true},
        unit: {type: String, 'default': 'px'}
    },

    child_format: {type: String, enum: ['list', 'radial', 'grid', 'none'], 'default': 'none'}
}