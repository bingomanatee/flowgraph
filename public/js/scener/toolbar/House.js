(function () {
    function init_house_toolbar() {
        Ticker.addListener(window);

        function _new_house(target) {
            target.onClick = function (evt) {
                var p = new House(
                    Math.round(Math.random() * 10 - Math.random() * 10),
                    Math.round(Math.random() * 10 - Math.random() * 10)
                );
                SCENER_CORE.house_container.addChild(p);
                SCENER_CORE.mode = '';
                SCENER_CORE.update = true;
            }
        }

        var b = new Bitmap('/js/scener/img/house.png')

        var s = new Shape(b);
        s.scaleX = s.scaleY = 0.25;
        s.x = s.y = 5;

        SCENER_CORE.add_toolbar_button(s, 3, _new_house);
        SCENER_CORE.update = true;

    }

    SCENER_CORE.on_inits.push(init_house_toolbar);
})()