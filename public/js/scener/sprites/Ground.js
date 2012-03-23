(function () {
    var grass_image = new Image();
    grass_image.src = '/js/scener/img/grass_green.png';
    SCENER_CORE.images.grass = grass_image;

    SCENER_CORE.on_inits.push(function () {

        grass_image.onload = function () {


            // enable touch interactions if supported on the current device:
            /*  if (Touch.isSupported()) {
             Touch.enable(stage);
             } */

            // enabled mouse over / out events
            var ground = new SCENER_CORE.sprites.Ground();
            ground.iso_diam_width = 60;
            ground.iso_diam_height = 30;
            ground.x = 500;
            ground.y = 300;
            ground.i_min = ground.j_min = -10;
            ground.init_terrain(20, 20);
            SCENER_CORE.ground_container.addChild(ground);
            SCENER_CORE.ground = ground;

        }

    })


})()