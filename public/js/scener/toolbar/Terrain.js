var concrete_image;
(function(){
function init_toolbar_terrain_button() {

    function _paint_terrain(target) {
        SCENER_CORE.mode = 'terrain';
    }

    concrete_image = new Image();
    concrete_image.src = '/js/scener/img/concrete.png';

    concrete_image.onload = function(){

        var g = new Graphics();

        g.beginBitmapFill(concrete_image);
        g.drawRect(8, 8, 50, 50);
        g.endFill();

        var s = new Shape(g);

        SCENER_CORE.add_toolbar_button(s, 2, _paint_terrain);
    }


}
    SCENER_CORE.on_inits.push(init_toolbar_terrain_button);

})