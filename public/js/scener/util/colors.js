SCENER_CORE.COLORS = (function () {

    var COLORS = {
        BLACK:Graphics.getHSL(0, 0, 0, 1),
        WHITE:Graphics.getHSL(0, 0, 100, 1)
    }

    var base_colors = {
        GREY:{h:0, s:0}
    }

    'RED,YELLOW,GREEN, TEAL,BLUE,MAGENTA'.split(',').forEach(
        function (c, i) {
            base_colors[c] = {h:60 * i, s:100};
        }
    );

    for (var v = 0; v <= 100; v += 5) {
        for (var c in base_colors) {
            var base_color = base_colors[c];
            var color_def = _.extend({}, base_color, {v:v});

            COLORS[c + v] = Graphics.getHSL(color_def.h, color_def.s, color_def.v, 1);

            for (var a = 0.0; a < 100; a += 20.0) {
            }
        }
    }

    return COLORS;
})();