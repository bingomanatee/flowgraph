var ejs = require('./../../node_modules/nuby-express/node_modules/ejs');
var fs = require('fs');
var _ = require('underscore');
var util = require('util');

function Column(key, label, config) {
    this.key = key;
    this.out_key = key;
    this.label = label;
    if (config) {
        _.extend(this, config);
    }
}

Column.prototype = {
    cell_style: '',
    cell_class: '',
    row_value:function (record) {
        if (this.key.indexOf('.') == -1) {
            return record[this.key];
        }
        var key = this.key.split('.');
        //      console.log('retrieving key %s from %s', key.join(':'), util.inspect(record));
        var base = record;
        var self = this;
        key.forEach(function (k) {
            try {
                base = base[k];
                if (_.isNull(base)) {
                    return null;
                }
            } catch (e) {
                return null;
            }
        //    console.log('retrieved %s: %s', k, util.inspect(base));
        });
        return base;
    }

};

module.exports = {
    Column:Column,

    prep_data:function (data, columns) {
        var out = [];
        data.forEach(function (record) {
            var out_record = {};
            columns.forEach(function (col) {
                var k = col.out_key;
                var v = col.row_value(record);
                out_record[k] = v;
            });
            out.push(out_record);
        });
        return out;
    },

    render:function (columns, records, callback, template) {
        records = module.exports.prep_data(records, columns);

        function _on_view(err, tpl) {

     //       console.log('records: %s', util.inspect(records));

            var props = {
                columns:columns,
                records:records
            };


            callback(null, ejs.render(tpl.toString(), props));
        }

        if (!template) {
            template = __dirname + '/view.html';
        }
        fs.readFile(template, _on_view);
    }

}