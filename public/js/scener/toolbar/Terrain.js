var concrete_image;

function init_toolbar_terrain_button() {

    function _paint_terrain(target) {
        scener_mode = 'terrain';

    }

    concrete_image = new Image();
    concrete_image.src = '/js/scener/img/concrete.png';

    concrete_image.onload = function(){

        var g = new Graphics();

        g.beginBitmapFill(concrete_image);
        g.drawRect(8, 8, 50, 50);
        g.endFill();

        var s = new Shape(g);

        add_toolbar_button(s, 2, _paint_terrain);
    }


}