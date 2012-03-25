
(function () {
    var concrete_image;
    function init_toolbar_terrain_button() {

        function _paint_terrain(target) {
            SCENER_CORE.mode = 'terrain';
        }

        SCENER_CORE.images.concrete = new Image();
        SCENER_CORE.images.concrete.src = '/js/scener/img/concrete.png';

        SCENER_CORE.images.concrete.onload = function () {

            var g = new Graphics();

            g.beginBitmapFill(SCENER_CORE.images.concrete);
            g.drawRect(8, 8, 50, 50);
            g.endFill();

            var s = new Shape(g);

            SCENER_CORE.add_toolbar_button(s, 2, _paint_terrain);
        }


    }

    SCENER_CORE.on_inits.push(init_toolbar_terrain_button);

})()