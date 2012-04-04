(function () {
    function init_tree_toolbar() {
        Ticker.addListener(window);

        function _new_tree(target) {
            target.onClick = function (evt) {
                var p = new Tree(
                    Math.round(Math.random() * 10 - Math.random() * 10),
                    Math.round(Math.random() * 10 - Math.random() * 10)
                );
                SCENER_CORE.house_container.addChild(p);
                SCENER_CORE.mode = '';
                SCENER_CORE.update = true;
            }
        }

        var b = new Bitmap('/js/scener/img/tree.png')

        var s = new Shape(b);
        s.scaleX = s.scaleY = 0.5;
        s.x = s.y = 5;

        SCENER_CORE.add_toolbar_button(s, 4, _new_tree);
        SCENER_CORE.update = true;

    }

    SCENER_CORE.on_inits.push(init_tree_toolbar);
})()