var menu = require('./node_modules/nuby-express/lib/support/menu');

module.exports = function (req_state, callback) {
    var menu_config = {
        title:'Home',
        link:'/',
        children:[
            {
                title:'Mars',
                link:'/mars'
            }
        ]
    };

    function _on_member(err, member) {
        if (member) {
            menu_config.children.unshift(
                {
                    title:'Account',
                    link:'/account'
                },
                {
                    title:'Sign Out',
                    link:'/signout'
                }
            );

            if (req_state.framework.resources.authorize('site.admin', member)) {
                menu_config.children.push({
                    title:'Admin',
                    link:'/admin',
                    children:[
                        {
                            title:'Members',
                            link:'/admin/members',
                            visible:function (req_state) {
                                var rpath = req_state.req.path;
                                return /\/admin/.test(rpath);
                            },
                            children:[
                                {
                                    title:'Tasks',
                                    link:'/admin/members/tasks',
                                    visible:function (req_state) {
                                        var rpath = req_state.req.path;
                                        return /\/admin\/members/.test(rpath);
                                    }}

                            ]
                        },
                        {
                            title:'Mars',
                            link: '/admin/mars',
                            visible:function (req_state) {
                                var rpath = req_state.req.path;
                                return /\/admin/.test(rpath);
                            },
                            children:[
                                {
                                    title:'Mapimages',
                                    link:'/admin/mars/mapimages',
                                    visible:function (req_state) {
                                        var rpath = req_state.req.path;
                                        return /\/admin\/mars/.test(rpath);
                                    }
                                }

                            ]
                        }

                    ]
                });
            }

        } else {
            menu_config.children.unshift({
                    title:'Join',
                    link:'/join'
                },
                {
                    title:'Sign In',
                    link:'/signin'
                });
        }


        var menu_obj = menu.create(menu_config);

        callback(null, menu_obj.render(req_state));
    }

    req_state.framework.resources.active_member(req_state, _on_member);

}