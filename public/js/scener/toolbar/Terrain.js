
(function () {
    var concrete_image;
    function init_toolbar_terrain_button() {

        function _paint_terrain(target) {
            target.onClick=function(evt){

                console.log('setting terrain mode to terrain. ')
                SCENER_CORE.mode = 'terrain';
            }
        }

        SCENER_CORE.images.concrete = new Image();
        SCENER_CORE.images.concrete.src = '/js/scener/img/concrete.png';

        SCENER_CORE.images.concrete.onload = function () {

            var b = new Bitmap('/js/scener/img/concrete.png')

            var s = new Shape(b);
            s.scaleX = s.scaleY = 0.25;
            s.x = s.y = 5;

            SCENER_CORE.add_toolbar_button(s, 2, _paint_terrain);
        }


    }

    SCENER_CORE.on_inits.push(init_toolbar_terrain_button);

})()