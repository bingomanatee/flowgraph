var _ = require('underscore');
var path = require('path');

var file = __dirname + '/scripts/' + process.argv[2];
var config_string = process.argv[3];
console.log('config string: %s', config_string);
var config = {};

var span_regex = /([^=]+)=(.+)/;

process.argv.slice(3).forEach(
    function (span) {
        console.log('span: %s', span);
        if (span_regex.test(span)) {
            var m = span_regex.exec(span);
            var key = m[1];
            var value = m[2];
            config[key] = value;
        } else {
            console.log('cannot parse %s', span);
        }
    }
);


if (path.existsSync(file)) {
    var script = require(file);
    script(config, function (err, result) {
        if (err) {
            console.log("============ ERROR IN SCRIPT %s =========== \n %s ============================", file, err);
        } else {
            console.log("============ DONE WITH SCRIPT %s =========== \n %s ============================", file, result);
        }
    });
}