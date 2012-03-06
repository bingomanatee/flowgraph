flowgraph.util.Point = function () {

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }


    Point.prototype = {

        rel_angle: function(p){
            if (this.equals(p)){
                return 0;
            }

            return Math.atan2(p.y - this.y, p.x - this.x);

        },

        equals: function(p, y){
            if (arguments.length > 1){
                return (this.x == p) && (this.y == y);
            } else {
                return (this.x = p.x) && (this.y = p.y);
            }
        }

    }

    return Point;
}();