var ejs = require('./../../node_modules/nuby-express/node_modules/ejs');
var fs = require('fs');

module.exports = function (content) {

    if (typeof content == 'string') {
        content = {content:content, title: ''};
    }
    if (!content.hasOwnProperty('style')) {
        content.style = false;
    }

    var tpl = fs.readFileSync(__dirname + '/view.html').toString();

    return ejs.render(tpl, content);
}