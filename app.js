var util = require('util');
var path = require('path');
var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());

var express = require('./node_modules/nuby-express/node_modules/express');
var ejs = require('./node_modules/nuby-express/node_modules/ejs');
var ne_static = require('./node_modules/nuby-express/lib/ne_static');
var ne = require('./node_modules/nuby-express');

var mongoose_init = require('./mongoose');

var session_secret = "I want to believe";
var port = 5103;
var static_contexts = [
    {root:__dirname + '/public', prefix:''}
];

var app = express.createServer();

//app.use(express.logger(...));
app.use(express.bodyParser());
app.use(express.cookieParser());

var MemoryStore = express.session.MemoryStore;
var session_store = new MemoryStore();
var session = express.session({secret:session_secret, store: session_store});
app.use(session);
app.set('session', session);
app.set('session_store', session_store);

app.set('view_engne', 'ejs');
app.register('.html', ejs);
app.set('view options', {layout:true});
app.set('views', __dirname + '/views');

app.set('static contexts', static_contexts);
app.use(ne_static({contexts:static_contexts}));

var fw_configs = {

    params:{
        session_secret:session_secret,
        flash_keys:['info', 'error'],
        mongo_params: mongoose_init.params,
        layout_id:'h5'
    },

    resources:{menu: require('./menu')},

    app_root:__dirname,
    app:app,
    _mongoose:null
}

var framework = new ne.Framework(fw_configs);

function _after_load() {

    function _on_mongoose_connected() {
        console.log('loaded ... listening on %s', port);
        app.listen(port);
    }

    framework.get_param({}, 'mongo_params', function (err, mongo_params) {
        mongoose_init.connect(mongo_params, _on_mongoose_connected);

    });
}

var layout_path = path.resolve(__dirname, '..', 'layouts');
console.log('layouts from %s', layout_path);
framework.add_layouts(layout_path, function () {
    var loader = new ne.Loader();

    loader.load(framework, _after_load, [ __dirname + '/app', path.resolve(__dirname, '..', 'components/members')]);

});

